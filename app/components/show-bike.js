import React from 'react';
import store from '../store';
import { History, Link } from 'react-router';
import BackboneMixin from '../mixins/backbone';
import BikeForm from './bike-form';

const ShowBike = React.createClass({

  propTypes: {
    children: React.PropTypes.node
  },

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
    let component = bike && bike.components || [];
    if(this.state.isEditing) {
      return <BikeForm initialBike={bike} onSave={this.handleEdit} />;
    } else {
      return (
        <div>
          <h1>{bike.name}</h1>
          <ul>
            {component.map((x) =>
              <li key={Math.round(Math.random() * 10000)}>
                {x.name}
              </li>
            )}

            </ul>
            {this.props.children || (
              <div>
                <Link className="button" to={'/bikes/' + this.props.params.id + '/addcomponents'}>Add Component</Link>
                <button onClick={this.handleEdit}>Edit</button>
                <button className="alert" onClick={this.handleDestroy}>Destroy</button>
              </div>
            )}

        </div>
      );
    }
  }
});

export default ShowBike;
