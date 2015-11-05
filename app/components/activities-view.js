import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone';

const Activity = React.createClass({
  render() {
    var activity = this.props.activity;
    // console.log(this.props)
    return (

      <li>
        {activity.name}
        <ul>
          <li>
            {activity.start_date_local}
          </li>
          <li>
            {activity.distance}
          </li>
          <li>
            {activity.type}
          </li>
        </ul>
        <select>
        {this.props.bikes.map((b)=> <option>{b.name}</option>)}
        </select>
      </li>
    )
  }
});
const ActivitiesView = React.createClass({

  mixins: [BackboneMixin],


  componentWillMount() {
    store.fetchBikes();
    store.fetchActivities();
  },

  getModels(){
    return{
      activities: store.getActivities(),
      bikes: store.getBikes()
    }

  },

  render(){
    var activities = this.state.activities;
    return(
      <div className="row">
        <div className="large-6 columns">
        <div className="large-10 columns">
        <ul>
          {activities.map((x) =>
            <Activity activity={x} bikes={this.state.bikes} key={x.id} />
          )}
        </ul>
        <div className="large-1 columns">
        </div>
        </div>
        </div>
      </div>
    );
  }
});

export default ActivitiesView;
