import React from 'react';
import { History } from 'react-router';
import store from '../store';

const Signup = React.createClass({

  propTypes: {
    location: React.PropTypes.object
  },

  mixins: [ History ],

  getInitialState() {
    return {
      error: false
    }
  },

  handleSubmit(event) {
    event.preventDefault()

    let email = this.refs.email.value;
    let username = email;
    let password = this.refs.password.value;

    store.createUser({username, password, email}).then(() => {
      let { location } = this.props;
      if (location.state && location.state.nextPathname) {
        this.history.replaceState(null, location.state.nextPathname);
      } else {
        this.history.replaceState(null, '/');
      }
    }, (xhr) => {
      this.setState({ error: xhr.responseJSON.error });
    });
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Sign Up</h1>
        <input ref="email" placeholder="email" />
        <input type="password" ref="password" placeholder="password" />
        <button type="submit">Sign Up</button>
        {this.state.error && (
          <p>{this.state.error}</p>
        )}
      </form>
    )
  }
});

export default Signup;
