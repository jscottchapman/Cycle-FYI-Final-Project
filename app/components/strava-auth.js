import React from 'react';
import {History} from 'react-router';
import stravaButton from 'assets/images/ConnectWithStrava@2x.png';

const StravaAuth = React.createClass({

  mixins: [History],

  render() {
    return (
      <a href="/authorize">
        <img src={stravaButton} alt="Connect with Strava" />
      </a>
    );
  }
})

export default StravaAuth;
