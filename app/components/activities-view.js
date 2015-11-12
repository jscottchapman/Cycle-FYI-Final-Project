import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone';
import moment from 'moment';
import $ from 'jquery';

const Activity = React.createClass({

  propTypes: {
    bikes: React.PropTypes.string,
    activity: React.PropTypes.object
  },

  handleAddActivity(e) {
    e.preventDefault();

    $.ajax({
      url: "https://api.parse.com/1/functions/reconcile",
      type: "POST",
      data: JSON.stringify({
        activityId: this.props.activity.objectId,
        bikeId: this.refs.selectedBike.value
      })
    }).then(() => {
      store.fetchActivities();
    });
  },

  render() {


    var activity = this.props.activity;
    // console.log(this.props)
    return (

      <li>
        <h4 className="bodytext">
          {activity.name}
        </h4>
        <ul className="bodytext">
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
        <select ref="selectedBike">
        {this.props.bikes.map((b)=> <option value={b.objectId}>{b.name}</option>)}
        </select>
        <button onClick={this.handleAddActivity}>Add</button>
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
            <ul className="textname">
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
