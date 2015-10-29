import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/app';
import BikeForm from './components/bike-form';
import Index from './components/index';
import Login from './components/login';
import Signup from './components/signup';
import ShowBike from './components/show-bike';

import store from './store';

function requireAuth(nextState, replaceState) {
  if( ! store.getSession().isAuthenticated ) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

function requireNotAuth(nextState, replaceState) {
  if(store.getSession().isAuthenticated) {
    replaceState({}, '/');
  }
}

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Index} onEnter={requireAuth} />

      <Route path="create" component={BikeForm} onEnter={requireAuth} />
      <Route path="bikes/:id" component={ShowBike} onEnter={requireAuth} />

      <Route path="login" component={Login} onEnter={requireNotAuth} />
      <Route path="signup" component={Signup} onEnter={requireNotAuth} />
    </Route>
  </Router>
), document.getElementById('application'));
