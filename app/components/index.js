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
          <div className="row">
            <div className="large-offset-5 large-5 columns">
              <h1>The Bike Garage</h1>

              <ul>
                {bikes.map((r, i) => {
                  return (<li key={r.objectId || i}><div className="bike-box"><Link className="large black-text" to={`/bikes/${r.objectId}`}>{r.name} </Link></div><br/></li>);
                })}
              </ul>
              <Link className="bodytext" to={`/activities`}>Ready to assign usage to your bikes?</Link>

          </div>

          </div>
          <div className="large-7 columns">

          </div>
      </div>
    );
  }

});

export default Index;
