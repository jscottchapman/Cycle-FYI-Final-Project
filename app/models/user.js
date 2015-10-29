import Backbone from 'backbone';

const User = Backbone.Model.extend({
  idAttribute: 'objectId',

  urlRoot() {
    if(localStorage.getItem('parse-session-token')) {
      return "https://api.parse.com/1/users/me";
    } else {
      return "https://api.parse.com/1/users";
    }
  }
});

export default User;
