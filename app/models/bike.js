import store from '../store';
import User from './user';
import _ from 'underscore';

var Bike = Backbone.Model.extend({
  idAttribute: 'objectId',
  urlRoot: "https://api.parse.com/1/classes/Bike",

  url: function() {
    var base = _.result(this, 'urlRoot');
    if (this.isNew()) return base;
    var id = this.get(this.idAttribute);
    return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id) + "?include=creator";
  },

  defaults() {
    return {
      creator: {toJSON: function() {}}
    }
  },

  parse(response) {
    response.creator = new User(_.omit(response.creator, '__type', 'className'), {parse: true});
    return response;
  },

  toJSON(options) {
    // I'm saving the model
    if(options) {
      return _.extend({}, this.attributes, {
        creator: {
          "__type": "Pointer",
          "className": "_User",
          "objectId": this.get('creator').id
        }
      });
    } else { // I'm using toJSON to use with React
      return _.extend({}, this.attributes, {
        creator: this.get('creator').toJSON()
      });
    }
  },

  save() {
    let currentUser = store.getSession().currentUser;
    if(currentUser) {
      this.set('creator', new User(currentUser));
      Backbone.Model.prototype.save.apply(this, arguments);
    } else {
      return new Promise((_, reject) => reject("Invalid session"));
    }
  }
});

export default Bike;
