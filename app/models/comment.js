import store from '../store';
import _ from 'underscore';
import User from './user';
import Bike from './bike';

/*

comments.create({
  text: "Hello",
  creator: store.getSession().get('currentUser'),
  bike: bike
});

 */

const Comment = Backbone.Model.extend({

  idAttribute: 'objectId',

  default() {
    return {
      bike: {toJSON: ()=>{}},
      creator: {toJSON: ()=>{}}
    };
  },

  parse(response) {
    response.creator = new User(_.omit(response.creator, '__type', 'className'), {parse: true});
    response.bike = new Bike(_.omit(response.bike, '__type', 'className'), {parse: true});
    return response;
  },

  toJSON(options) {
    // I'm saving the model
    if(options) {

      return _.extend({}, this.attributes, {
        bike: {
          "__type": "Pointer",
          "className": "Bike",
          "objectId": this.get('bike').id
        },
        creator: {
          "__type": "Pointer",
          "className": "_User",
          "objectId": this.get('creator').id
        }
      });

    // I'm using toJSON to get a simple object of attributes
    } else {

      return _.extend({}, this.attributes, {
        bike: this.get('bike').toJSON(),
        creator: this.get('creator').toJSON()
      });

    }
  }
});

export default Comment;
