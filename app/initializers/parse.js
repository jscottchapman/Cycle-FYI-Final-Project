import $ from 'jquery';

$.ajaxSetup({
  beforeSend(xhr, options) {
    if(options.url.match(/api.parse.com/)) {
      xhr.setRequestHeader('X-Parse-Application-Id', 'q472fWAzzXYlNqlH8fUo9iDkoyL0K6KKHmPVWgzE');
      xhr.setRequestHeader('X-Parse-REST-API-Key', 'qF6nBaO4yCsefCVU8ttN6cN63m7uaJJzwNgMOFTT');
      if(localStorage.getItem('parse-session-token')) {
        xhr.setRequestHeader('X-Parse-Session-Token', localStorage.getItem('parse-session-token'));
      }
    }
  }
});
