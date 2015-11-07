import store from '../store';
import _ from 'underscore';
import User from './user';
import Bike from './bike';

const Component = Backbone.Model.extend({

  idAttribute: 'objectId',

  defaults() {
    return {
      name: "",
      mileage: "",
      creator: "",
    }
  },

  toJSON(options) {
    // I'm saving the model
    if(options) {
      var bike = this.get('onWhatBike') ? {
        "__type": "Pointer",
        "className": "Bike",
        "objectId": this.get('onWhatBike').id
      } : null;
      return _.extend({}, this.attributes, {
        onWhatBike: bike
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
