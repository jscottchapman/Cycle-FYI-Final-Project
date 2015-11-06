import _ from 'underscore';
import Backbone from 'backbone';

import Session from './models/session';
import Component from './models/component';
import ComponentsCollection from './models/components-collection';
import Bike from './models/bike';
import BikesCollection from './models/bikes-collection';
import CommentsCollection from './models/comments-collection';
import User from './models/user';
import Activity from './models/strava';
let activities = new Activity();
let session = new Session();
let bikes = new BikesCollection();

let componentsCache = {};

const Store = _.extend({}, Backbone.Events, {

  initialize() {
    this.listenTo(bikes, 'add change remove', this.trigger.bind(this, 'change'));
    this.listenTo(activities, 'add change remove', this.trigger.bind(this, 'change'));

    this.listenTo(session, 'change', this.trigger.bind(this, 'change'));
  },

  getActivities() {
    return activities.toJSON();
  },

  fetchActivities() {
    return activities.fetch();
  },


  getComponents() {
    return components.toJSON();

  },

  fetchComponents() {
    return components.fetch();
  },



  getComponent(id) {
    let component = components.get(id);
    if(component) {
      return component.toJSON();
    } else {
      components.fetch();
      return {};
    }
  },

  saveComponent(component, options) {
    return components.create(component, options);
  },

  destroyComponent(component) {
    return components.get(component.objectId).destroy();
  },

  getComponentsForBike(id) {
    let components = (componentsCache[id] = componentsCache[id] || new ComponentsCollection(null, {bikeId: id}));
    this.stopListening(components);
    this.listenTo(components, 'add remove change', this.trigger.bind(this, 'change'));
    return components.toJSON();
  },

  fetchComponentsForBike(id) {
    let components = (componentsCache[id] = componentsCache[id] || new ComponentsCollection(null, {bikeId: id}));
    this.stopListening(components);
    this.listenTo(components, 'add remove change', this.trigger.bind(this, 'change'));
    return components.fetch();
  },

  saveComponentOnBike(id, component) {
    let components = (componentsCache[id] = componentsCache[id] || new ComponentsCollection(null, {bikeId: id}));
    this.stopListening(components);
    this.listenTo(components, 'add remove change', this.trigger.bind(this, 'change'));
    components.create(_.extend({}, component, {
      bike: {objectId: id},
    }));
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
