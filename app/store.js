import _ from 'underscore';
import Backbone from 'backbone';

import Session from './models/session';
import Bike from './models/bike';
import BikesCollection from './models/bikes-collection';
import CommentsCollection from './models/comments-collection';
import User from './models/user';

let session = new Session();
let bikes = new BikesCollection();

const Store = _.extend({}, Backbone.Events, {

  initialize() {
    this.listenTo(bikes, 'add change remove', this.trigger.bind(this, 'change'));
    this.listenTo(session, 'change', this.trigger.bind(this, 'change'));
  },

  getBikes() {
    return bikes.toJSON();
  },

  fetchBikes() {
    return bikes.fetch();
  },

  getBike(id) {
    let bike = bikes.get(id);
    if(bike) {
      return bike.toJSON();
    } else {
      bikes.fetch();
      return {};
    }
  },

  saveBike(bike, options) {
    return bikes.create(bike, options);
  },

  destroyBike(bike) {
    return bikes.get(bike.objectId).destroy();
  },

  invalidateSession() {
    return session.invalidate();
  },

  authenticateSession(options) {
    return session.authenticate(options);
  },

  getSession(){
    return session.toJSON();
  },

  restoreSession() {
    return session.restore();
  },

  createUser(attributes) {
    // TODO: this user should become the currentUser, instead of fetching again
    let user = new User(attributes);
    return user.save().then(() => {
      return session.authenticate({sessionToken: user.get('sessionToken')});
    });
  }
});

Store.initialize();

export default Store;
