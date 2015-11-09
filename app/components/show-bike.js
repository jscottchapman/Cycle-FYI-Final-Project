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

  componentWillMount() {
    store.fetchComponentsForBike(this.props.params.id);
  },

  getModels() {
    return {
      bike: store.getBike(this.props.params.id),
      components: store.getComponentsForBike(this.props.params.id)
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

  handleComponent(e) {
    e.preventDefault();
    store.componentOnBike(this.props.params.id, this.refs.component.value);
    this.refs.component.value = '';
  },

  render() {
    let bike = this.state.bike;
    let components = this.state.components;

    if(this.state.isEditing) {
      return <BikeForm initialBike={bike} onSave={this.handleEdit} />;
    } else {
      return (
        <div>
          <h1>{bike.name}</h1>
          <ul className="bodytext">
            {components.map((x) =>
              <li key={x.objectId || Date.now()}>
                {x.name}--{x.miles}/{x.threshold}miles

              </li>
            )}

            </ul>
            {this.props.children || (
              <div>
                <Link className="button addcompbutton" to={'/bikes/' + this.props.params.id + '/addcomponents'}>Add Component</Link>
                <button onClick={this.handleEdit}>Edit</button>
                <button className="alert" onClick={this.handleDestroy}>Destroy</button>
              </div>
            )}
            <Link to={`/activities`}>Ready to assign usage?</Link>
        </div>
      );
    }
  }
});

export default ShowBike;
