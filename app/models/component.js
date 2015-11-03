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
    }
  },
});


export default Component;
