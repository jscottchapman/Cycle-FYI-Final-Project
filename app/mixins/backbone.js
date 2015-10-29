import Backbone from 'backbone';
import _ from 'underscore';
import store from '../store';

const BackboneMixin = _.extend({}, Backbone.Events, {

  _getUpdatedState() {
    return (this.getModels && this.getModels()) || null;
  },

  getInitialState() {
    return this._getUpdatedState();
  },


  componentWillMount() {
    this.listenTo(store, 'change', () => {
      let state = this._getUpdatedState();
      state && this.setState(state);
    });
  },

  componentWillUnmount() {
    this.stopListening();
  }

});

export default BackboneMixin;
