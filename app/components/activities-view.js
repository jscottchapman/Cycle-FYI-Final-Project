import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone';
import moment from 'moment';
const Activity = React.createClass({

  propTypes: {
    bikes: React.PropTypes.string,
    activity: React.PropTypes.object
  },
  render() {


    var activity = this.props.activity;
    // console.log(this.props)
    return (

      <li>
        {activity.name}
        <ul>
          <li>
            {moment(activity.start_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </li>
          <li>
            {(activity.distance * 0.000621371192).toFixed(2) + " miles"}
          </li>
          <li>
            {activity.location_city}, {activity.location_state}
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
        <div className="large-2 columns"/>
          <div className="large-8 columns">
            <ul>
              {activities.map((x) =>
                <Activity activity={x} bikes={this.state.bikes} key={x.id} />
              )}
            </ul>
          </div>
        <div className="large-2 columns"/>
    </div>
    );
  }
});

export default ActivitiesView;
