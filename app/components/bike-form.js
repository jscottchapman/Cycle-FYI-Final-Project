import React from 'react';
import store from '../store';
import { History } from 'react-router';
import BackboneMixin from '../mixins/backbone';
import update from 'react-addons-update';



/* change RecipeForm to BikeForm*/

const BikeForm = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    initialBike: React.PropTypes.object,
    onSave: React.PropTypes.func
  },

  mixins: [History, BackboneMixin],

  getInitialState() {
    return {
      bike: this.props.initialBike || {
        components: []
      }
    };
  },

  handleChange(prop, e) {
    let newState = {};
    newState[prop] = {
      $set: e.target.value
    };

    this.setState({
      bike: update(this.state.bike, newState)

    });
  },

  handleSubmit(e) {
    e.preventDefault();

    let bike = this.state.bike;
    store.saveBike(bike);

    // TODO: this isn't quite working, state is out of date
    if(this.props.onSave) {
      this.props.onSave(bike);
    } else {
      this.history.pushState({}, '/');
    }
  },

  handleAddComponent(component) {
    this.setState({
      bike: update(this.state.bike, {
        components: {$push: [component]}
      })
    });
  },

  render() {
    let bike = this.state.bike;
    let startdist = this.state.startdist;
    return (
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <input placeholder="Bike Name" value={bike.name} onChange={this.handleChange.bind(this, 'name')} />
            <input placeholder="Starting Distance(In Miles)" value={bike.startdist} onChange={this.handleChange.bind(this, 'startdist')} />
          </fieldset>


          <button type="submit" onClick={this.handleSubmit}>Save</button>
        </form>
    );
  }
});

export default BikeForm;
