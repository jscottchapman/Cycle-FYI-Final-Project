import Promise from 'es6-promise';
Promise.polyfill();

import './initializers/parse';
import './initializers/session';

import './router';
