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
    store.fetchShelf(this.props.params.id)
  },

  getModels() {
    return {
      bike: store.getBike(this.props.params.id),
      components: store.getComponentsForBike(this.props.params.id),
      shelf: store.getShelf(this.props.params.id)
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

  removeComponent(component, e) {
    store.saveComponentToShelf(component);
  },

  getShelf(component) {
    store.getComponentFromShelf(component);
  },

  saveOnBike(component) {
    store.saveComponentOnBike(component);
  },

  render() {
    let bike = this.state.bike;
    let components = this.state.components;
    let shelf = this.state.shelf;

    if(this.state.isEditing) {
      return <BikeForm initialBike={bike} onSave={this.handleEdit} />;
    } else {
      return (
        <div>
          <div className="row">
            <div className="large-4 columns">
              <h1>{bike.name}</h1>
                <ul className="bodytext">
                  {components.map((x) =>
                    <li key={x.objectId || Date.now()}>
                      {x.name}--{x.miles}/{x.threshold}miles
                        <button className="tiny button radius" onClick={this.removeComponent.bind(this, x)}>Remove component from bike</button>
                        <hr/>
                    </li>
                  )}
                  </ul>
                  <div className="large-8 columns"></div>
              </div>

            </div>
            {this.props.children || (
              <div>
                <ul className="white-text">
                  {shelf.map((x) =>
                    <li key={x.objectId || Date.now()} value={x.objectId}>
                      {x.name}--{x.miles}/{x.threshold}miles
                    <button onClick={this.saveOnBike.bind(this, x)}>Save to this bike</button></li>
                  )}

                </ul>
                <Link className="button medium addcompbutton radius" to={'/bikes/' + this.props.params.id + '/addcomponents'}>Add Component</Link>
                <button className="button medium" onClick={this.handleEdit}>Edit</button>


              </div>
            )}
            <Link to={`/activities`}>Ready to assign usage?</Link>
            <button className="alert medium radius" onClick={this.handleDestroy}>Destroy Bike Forever</button>
        </div>
      );
    }
  }
});

export default ShowBike;
