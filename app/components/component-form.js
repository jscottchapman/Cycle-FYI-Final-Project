import React from 'react';
import store from '../store';
import { History } from 'react-router';
import BackboneMixin from '../mixins/backbone';
import update from 'react-addons-update';

const ComponentInput = React.createClass({

  propTypes: {
    name: React.PropTypes.string,
    miles: React.PropTypes.number,
    isNew: React.PropTypes.bool,
    onAdd: React.PropTypes.func,
    onSave: React.PropTypes.func
  },

  mixins: [BackboneMixin],

  handleAddComponent(e) {
    e.preventDefault();
    this.props.onAdd({
      name: this.refs.name.value,
      miles: Number(this.refs.miles.value)
    });

    this.refs.name.value = '';
    this.refs.miles.value = '';

    this.setState({
      component: update(this.state.component, {
        components: {$push: [component]}
      })
    });

    },

    handleSubmit(e) {
      e.preventDefault();

      let component = this.state.component;
      store.saveComponent(component, {parse: true});

      if(this.props.onSave) {
        this.props.onSave(component);
      } else {
        this.history.pushState({}, '/');
      }
    },

  render() {
    return (
      <fieldset>
        <input type="text" placeholder="Component" defaultValue={this.props.name} ref="name" />
        <input type="number" placeholder="Mileage" defaultValue={this.props.miles} ref="miles" />

        {this.props.isNew && <button onClick={this.handleAddComponent}>Add</button>}
      </fieldset>
    );
  }
});

export default ComponentInput;
