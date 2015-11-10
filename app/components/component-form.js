import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone';
import {History} from 'react-router';

const ComponentInput = React.createClass({

  mixins: [BackboneMixin, History],

  handleAddComponent(e) {

    e.preventDefault();

    this.history.goBack();


    store.saveComponentOnBike(
      this.props.params.id,
      {
      name: this.refs.name.value,
      miles: Number(this.refs.miles.value),
      threshold: Number(this.refs.threshold.value)
    });

    this.refs.name.value = '';
    this.refs.miles.value = '';
    this.refs.threshold.value = '';

    },

  handleCancel() {
    this.history.goBack();
  },

  render() {
    



    return (
      <div className="row">
          <div className="large-4 columns">

            <fieldset>
            <input type="text" placeholder="New Component" ref="name" />
            <input type="number" placeholder="Starting Mileage" ref="miles" />
            <input type="number" placeholder="Maintenance Threshold(in Miles)" ref="threshold" />
            <button onClick={this.handleAddComponent}>Add</button>
            <button className="alert" onClick={this.handleCancel}>Cancel</button>
            </fieldset>
          </div>
        <div className="large-8 columns">
        </div>
      </div>
    );
  }
});

export default ComponentInput;
