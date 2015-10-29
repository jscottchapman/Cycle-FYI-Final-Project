import React from 'react';
import store from '../store';
import { Link } from 'react-router';
import BackboneMixin from '../mixins/backbone';

var Index = React.createClass({

  mixins: [BackboneMixin],


  componentWillMount() {
    store.fetchBikes();
  },

  getModels() {
    return {
      bikes: store.getBikes()
    }
  },

  render() {
    var bikes = this.state.bikes;
    // TODO: creator username is flashing
    return (
      <div>
        <h1>Index</h1>
        <ul>
          {bikes.map((r, i) => {
            return (<li key={r.objectId || i}><Link to={`/bikes/${r.objectId}`}>{r.name} - ({r.creator.username})</Link></li>);
          })}
        </ul>
      </div>
    );
  }

});

export default Index;
