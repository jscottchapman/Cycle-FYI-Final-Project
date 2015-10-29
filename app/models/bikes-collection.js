import Bike from './bike';

var BikesCollection = Backbone.Collection.extend({
  model: Bike,
  url: "https://api.parse.com/1/classes/Bike?include=creator",
  parse(response) {
    return response.results;
  }
});

export default BikesCollection;
