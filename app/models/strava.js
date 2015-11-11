import store from '../store';
import User from './user';
import _ from 'underscore';

var Activity = Backbone.Collection.extend({
  url: "https://api.parse.com/1/functions/fetchActivities",
  sync : function(method, collection, options) {
    return Backbone.sync(method, collection, _.extend({}, options, {type: "POST"}));
  },

  parse(response) {
    return response.result;
  }
});
export default Activity;
