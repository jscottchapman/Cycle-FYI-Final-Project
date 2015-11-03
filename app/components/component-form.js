import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone';

const ComponentInput = React.createClass({

  mixins: [BackboneMixin],

  handleAddComponent(e) {
    e.preventDefault();

    store.saveComponent({
      name: this.refs.name.value,
      miles: Number(this.refs.miles.value),
      onWhatBike: this.props.params.id
    });

    this.refs.name.value = '';
    this.refs.miles.value = '';

    },

  render() {
    return (
      <fieldset>
        <input type="text" placeholder="Component" ref="name" />
        <input type="number" placeholder="Starting Mileage" ref="miles" />
        <button onClick={this.handleAddComponent}>Add</button>
      </fieldset>
    );
  }
});

export default ComponentInput;
