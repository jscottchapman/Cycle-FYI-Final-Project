import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone';
import {History} from 'react-router';

const ComponentInput = React.createClass({

  mixins: [BackboneMixin, History],

  handleAddComponent(e) {

    e.preventDefault();

    this.history.goBack();


    store.saveComponent({
      onWhatBike: {id:this.props.params.id},
      name: this.refs.name.value,
      miles: Number(this.refs.miles.value)
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
