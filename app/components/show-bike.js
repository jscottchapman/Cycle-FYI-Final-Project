import React from 'react';
import store from '../store';
import { History } from 'react-router';
import BackboneMixin from '../mixins/backbone';
import BikeForm from './bike-form';

const ShowBike = React.createClass({
  mixins: [History, BackboneMixin],

  getInitialState() {
    return {
      isEditing: false
    };
  },

  getModels() {
    return {
      bike: store.getBike(this.props.params.id)
    };
  },

  handleEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  },

  handleDestroy(e) {
    e.preventDefault();
    if(confirm("Are you sure?")){
      store.destroyBike(this.state.bike).then(() => {
        this.history.replaceState(null, '/');
      });
    }
  },

  render() {
    let bike = this.state.bike;
    if(this.state.isEditing) {
      return <BikeForm initialBike={bike} onSave={this.handleEdit} />;
    } else {
      return (
        <div>
          <h1>{bike.name}</h1>
          <button onClick={this.handleEdit}>Edit</button>
          <button className="alert" onClick={this.handleDestroy}>Destroy</button>
        </div>
      );
    }
  }
});

export default ShowBike;
