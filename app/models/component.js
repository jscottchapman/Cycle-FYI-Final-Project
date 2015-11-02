import store from '../store';
import _ from 'underscore';
import User from './user';
import Bike from './bike';

const Component = Backbone.Model.extend({

  idAttribute: 'objectId',

  defaults() {
    return {
      onWhatBike: {},

    }
  },

  toJSON(options) {
    // I'm saving the model
    if(options) {

      return _.extend({}, this.attributes, {
        onWhatBike: {
          "__type": "Pointer",
          "className": "Bike",
          "objectId": this.get('name').objectId
        },


      });

    // I'm using toJSON to get a simple object of attributes
    } else {
      return _.clone(this.attributes);
    }
  },

  save() {
    let currentUser = store.getSession().currentUser;
    if(currentUser) {
      if(this.isNew()) {
        this.set('creator', currentUser);
      }
      Backbone.Model.prototype.save.apply(this, arguments);
    } else {
      return new Promise((_, reject) => reject("Invalid session"));
    }
  }
});

export default Component;
