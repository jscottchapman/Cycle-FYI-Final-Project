import React from 'react';
import { History } from 'react-router';
import store from '../store';

const Login = React.createClass({

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

    let username = this.refs.email.value
    let password = this.refs.password.value

    store.authenticateSession({username, password}).then((loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true })

      var { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.history.replaceState(null, location.state.nextPathname)
      } else {
        this.history.replaceState(null, '/')
      }
    })
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <input ref="email" placeholder="email" />
        <input type="password" ref="password" placeholder="password" />
        <button type="submit">Login</button>
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    )
  }
})

export default Login;
