/**
 * Login With Strava
 *
 * Adapted from https://github.com/ParsePlatform/CloudCodeOAuthGitHubTutorial
 * Adapted by Jacob Smith (jake@theironyard.com)
 *
 * There are two routes:
 * /authorize - This url will start the OAuth process and redirect to Strava
 * /oauthCallback - Sent back from Strava, this will validate the authorization
 *                    and create/update a Parse User before using 'become' to
 *                    set the user on the client side and redirecting to /
 */

/**
 * Load needed modules.
 */
var express = require('express');
var querystring = require('querystring');
var _ = require('underscore');
var Buffer = require('buffer').Buffer;

/**
 * Create an express application instance
 */
var app = express();

/**
 * GitHub specific details, including application id and secret
 */
// var stravaClientId = '8579';
// var stravaClientSecret = '9c1ad3d0e555cc7c187bcc4ac33827fa3cd63350';
var stravaClientId = '9001';
var stravaClientSecret = '768e31e147d738f3f2490bc71435f5a7c98ca375';

/**
 * In the Data Browser, set the Class Permissions for these 2 classes to
 *   disallow public access for Get/Find/Create/Update/Delete operations.
 * Only the master key should be able to query or write to these classes.
 */
var TokenRequest = Parse.Object.extend("TokenRequest");
var TokenStorage = Parse.Object.extend("TokenStorage");

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

/**
 * Global app configuration section
 */
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

/**
 * Login with GitHub route.
 *
 * When called, generate a request token and redirect the browser to GitHub.
 */
app.get('/authorize', function(req, res) {

  var tokenRequest = new TokenRequest();
  // Secure the object against public access.
  tokenRequest.setACL(restrictedAcl);
  /**
   * Save this request in a Parse Object for validation when Strava responds
   * Use the master key because this class is protected
   */
  tokenRequest.save(null, { useMasterKey: true }).then(function(obj) {
    /**
     * Redirect the browser to Strava for authorization.
     * This uses the objectId of the new TokenRequest as the 'state'
     *   variable in the Strava redirect.
     */
    var stravaRedirectEndpoint = 'https://www.strava.com/oauth/authorize?';
    res.redirect(
      stravaRedirectEndpoint + querystring.stringify({
        client_id: stravaClientId,
        response_type: 'code',
        scope: 'view_private',
        redirect_uri: req.protocol + '://' + req.get('host') + '/oauthCallback',
        state: obj.id
      })
    );
  }, function(error) {
    // If there's an error storing the request, render the error page.
    res.render('error', { errorMessage: 'Failed to save auth request.'});
  });

});

/**
 * OAuth Callback route.
 *
 * This is intended to be accessed via redirect from GitHub.  The request
 *   will be validated against a previously stored TokenRequest and against
 *   another GitHub endpoint, and if valid, a User will be created and/or
 *   updated with details from GitHub.  A page will be rendered which will
 *   'become' the user on the client-side and redirect to the /main page.
 */
app.get('/oauthCallback', function(req, res) {
  var githubValidateEndpoint = 'https://github.com/login/oauth/access_token';
  var data = req.query;
  var token;
  /**
   * Validate that code and state have been passed in as query parameters.
   * Render an error page if this is invalid.
   */
  if (!(data && data.code && data.state)) {
    res.render('error', { errorMessage: 'Invalid auth response received.'});
    return;
  }

  /**
   * Use the master key as operations on TokenRequest are protected
   */
  Parse.Cloud.useMasterKey();

  /**
   * Check if the provided state object exists as a TokenRequest
   */
  var query = new Parse.Query(TokenRequest);
  Parse.Promise.as().then(function() {
    return query.get(data.state);
  }).then(function(obj) {
    // Destroy the TokenRequest before continuing.
    return obj.destroy();
  }).then(function() {
    // Validate & Exchange the code parameter for an access token from GitHub
    return getStravaAccessToken(data.code);
  }).then(function(access) {
    /**
     * Process the response from Strava
     */
    var data = access.data;
    if (data && data.access_token && data.athlete) {
      return upsertStravaUser(data.access_token, data.athlete);
    } else {
      return Parse.Promise.error("Invalid access request.");
    }
  }).then(function(user) {
    /**
     * Save the session token to a cookie and redirect to the React app
     */
    res.cookie('X-Parse-Session-Token', user.getSessionToken());
    res.redirect('/');
  }, function(error) {
    /**
     * If the error is an object error (e.g. from a Parse function) convert it
     *   to a string for display to the user.
     */
    if (error && error.code && error.error) {
      error = error.code + ' ' + error.error;
    }
    res.render('error', { errorMessage: JSON.stringify(error) });
  });

});

/**
 * Attach the express app to Cloud Code to process the inbound request.
 */
app.listen();

/**
 * This function is called when GitHub redirects the user back after
 *   authorization.  It calls back to GitHub to validate and exchange the code
 *   for an access token.
 */
var getStravaAccessToken = function(code) {
  var stravaTokenEndpoint = 'https://www.strava.com/oauth/token';

  var body = querystring.stringify({
    client_id: stravaClientId,
    client_secret: stravaClientSecret,
    code: code
  });

  return Parse.Cloud.httpRequest({
    method: 'POST',
    url: stravaTokenEndpoint,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Parse.com Cloud Code'
    },
    body: body
  });
}

/**
 * This function checks to see if this GitHub user has logged in before.
 * If the user is found, update the accessToken (if necessary) and return
 *   the users session token.  If not found, return the newGitHubUser promise.
 */
var upsertStravaUser = function(accessToken, athlete) {
  var query = new Parse.Query(TokenStorage);
  query.equalTo('strava_id', athlete.id);
  query.ascending('createdAt');
  var password;
  // Check if this githubId has previously logged in, using the master key
  return query.first({ useMasterKey: true }).then(function(tokenData) {
    // If not, create a new user.
    if (!tokenData) {
      return newStravaUser(tokenData, athlete);
    }
    // If found, fetch the user.
    var user = tokenData.get('user');
    return user.fetch({ useMasterKey: true }).then(function(user) {
      // Update the accessToken if it is different.
      if (accessToken !== tokenData.get('accessToken')) {
        tokenData.set('accessToken', accessToken);
      }
      /**
       * This save will not use an API request if the token was not changed.
       * e.g. when a new user is created and upsert is called again.
       */
      return tokenData.save(null, { useMasterKey: true });
    }).then(function(obj) {

      /**
       * Update the athlete data
       */
      user.set('strava_data', athlete);

      password = new Buffer(24);
      _.times(24, function(i) {
        password.set(i, _.random(0, 255));
      });
      password = password.toString('base64')

      user.setPassword(password);
      return user.save();
    }).then(function(user) {
      return Parse.User.logIn(user.get('username'), password);
    }).then(function(user) {
      // Return the user object.
      return Parse.Promise.as(user);
    });
  });
}

/**
 * This function creates a Parse User with a random login and password, and
 *   associates it with an object in the TokenStorage class.
 * Once completed, this will return upsertStravaUser.  This is done to protect
 *   against a race condition:  In the rare event where 2 new users are created
 *   at the same time, only the first one will actually get used.
 */
var newStravaUser = function(accessToken, athlete) {
  var user = new Parse.User();
  // Generate a random username and password.
  var username = new Buffer(24);
  var password = new Buffer(24);
  _.times(24, function(i) {
    username.set(i, _.random(0, 255));
    password.set(i, _.random(0, 255));
  });
  user.set("username", username.toString('base64'));
  user.set("password", password.toString('base64'));
  // Sign up the new User
  return user.signUp().then(function(user) {
    // create a new TokenStorage object to store the user+Strava association.
    var ts = new TokenStorage();
    ts.set('strava_id', athlete.id);
    ts.set('strava_data', athlete);
    ts.set('accessToken', accessToken);
    ts.set('user', user);
    ts.setACL(restrictedAcl);
    // Use the master key because TokenStorage objects should be protected.
    return ts.save(null, { useMasterKey: true });
  }).then(function(tokenStorage) {
    return upsertStravaUser(accessToken, athlete);
  });
}
var Activity = Parse.Object.extend("Activity");
var Bike = Parse.Object.extend("Bike");

/**
 * Cloud function which will load a user's accessToken from TokenStorage and
 * request their activities from Strava for display on the client side.
 */

var syncActivities = function(user) {
  if (!user) {
    return Parse.Promise.error('Must be logged in.');
  }

  var query = new Parse.Query(TokenStorage);
  query.equalTo('user', user);
  query.ascending('createdAt');
  return Parse.Promise.as().then(function() {
    return query.first({ useMasterKey: true });
  }).then(function(tokenData) {
    if (!tokenData) {
      return Parse.Promise.error('No Strava user found.');
    }

    var accessToken = tokenData.get('accessToken');

    return Parse.Cloud.httpRequest({
      url: 'https://www.strava.com/api/v3/athlete/activities?access_token=' + accessToken
    });
  }).then(function(httpResponse) {
    var activities = JSON.parse(httpResponse.text) || [];
    var promises = activities.map(function(a) {
      if(a.type !== "Ride") return;
      a.strava_id = a.id;
      delete a.id;
      var query = new Parse.Query("Activity");
      query.equalTo('strava_id', a.strava_id);
      return query.first().then(function(result) {
        var activity = result || new Activity({owner: user});
        activity.set(a);
        return activity.save();
      });
    });
    return Parse.Promise.when(promises);
  }, function(error) {
    return Parse.Promise.error(error);
  });
}

Parse.Cloud.define('syncActivities', function(req, res) {
  syncActivities(req.user).then(function(){
    res.success();
  }, function(error) {
    res.error(error);
  });
});

Parse.Cloud.define('fetchActivities', function(req, res) {
  syncActivities(req.user).then(function(){
    var query = new Parse.Query("Activity");
    query.equalTo('owner', req.user);
    query.doesNotExist('reconciledAt');
    query.notEqualTo('archived', true);
    return query.find();
  }).then(function(activities) {
    res.success(activities);
  }, function(error) {
    res.error(error);
  });
});

Parse.Cloud.define("reconcile", function(req, res) {
  var activityId = req.params.activityId;
  var bike = new Bike({objectId: req.params.bikeId});

  var activity;

  var activityQuery = new Parse.Query("Activity");
  return activityQuery.get(activityId).then(function(result) {
    activity = result;
    return activity.save({
      onWhatBike: bike,
      reconciledAt: new Date()
    });
  }).then(function() {
    var componentsQuery = new Parse.Query("Component");
    componentsQuery.equalTo('onWhatBike', bike);
    return componentsQuery.each(function(component) {
      var metersInAMile = 1609.34;
      var miles = activity.get('distance') / metersInAMile;
      component.increment('miles', miles);
      return component.save();
    });
  }).then(function(){
    res.success();
  }, function(error) {
    res.error(error);
  });
});
