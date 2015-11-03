import Component from './component';

var ComponentsCollection = Backbone.Collection.extend({
  model: Component,
  url: "https://api.parse.com/1/classes/Component",
  parse(response) {
    return response.results;

  console.log(response);
  }
});

export default ComponentsCollection;
