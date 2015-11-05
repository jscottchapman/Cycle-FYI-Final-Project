import React from 'react';
import store from '../store';
import BackboneMixin from '../mixins/backbone'
const Activity = React.createClass({
  render() {
    var activity = this.props.activity;
    // console.log(this.props)
    return (
      <li>
        {activity.name}
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
      <div>
        <ul>
          {activities.map((x) =>
            <Activity activity={x} bikes={this.state.bikes} key={x.id} />
          )}
        </ul>
      </div>
    );
  }
});

export default ActivitiesView;
