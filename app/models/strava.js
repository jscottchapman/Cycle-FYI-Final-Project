
var Activity = Backbone.Model. extend ({
  dAttribute: 'Id',
});
var ActivitiesCollection = Backbone.Collection.extend({
  url: "https://www.strava.com/api/v3/athlete/activities?access_token=7e831a3d531f974bbe36df05c3f390e8a8477212",
  sync : function(method, collection, options) {
    options.dataType = "jsonp";
    return Backbone.sync(method, collection, options);
  },
});


export default ActivitiesCollection;
