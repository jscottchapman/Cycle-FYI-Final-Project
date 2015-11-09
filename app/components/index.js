import React from 'react';
import Router from 'react-router';
import store from '../store';
import { Link } from 'react-router';
import BackboneMixin from '../mixins/backbone';

var Index = React.createClass({


  contextTypes() {
    router: React.PropTypes.func
  },

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
    return (
      <div className="bodytext">
        <h1>The Bike Garage</h1>
        <ul>
          {bikes.map((r, i) => {
            return (<li key={r.objectId || i}><Link to={`/bikes/${r.objectId}`}>{r.name} </Link></li>);
          })}
        </ul>
        <Link className="bodytext" to={`/activities`}>Ready to assign usage?</Link>
      </div>
    );
  }

});

export default Index;
