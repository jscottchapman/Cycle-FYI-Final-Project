import store from '../store';
import _ from 'underscore';
import User from './user';
import Bike from './bike';

const Component = Backbone.Model.extend({

  idAttribute: 'objectId',

  toJSON(options) {
    // I'm saving the model
    if(options) {

      return _.extend({}, this.attributes, {
        onWhatBike: {
          "__type": "Pointer",
          "className": "Bike",
          "objectId": this.get('onWhatBike').id
        },

      });

    // I'm using toJSON to get a simple object of attributes
    } else {

      return _.extend({}, this.attributes, {
        bike: this.get('bike').toJSON(),
      });

    }
  },

  defaults() {
    return {
      name: "",
      mileage: "",
    }
  },


});


export default Component;
