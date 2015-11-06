import Component from './component';

var ComponentsCollection = Backbone.Collection.extend({
  model: Component,
  url(){

    // "https://api.parse.com/1/classes/Component?include=creator,bike&bikeId=" + this.bikeId
    return "https://api.parse.com/1/classes/Component?include=creator,bike&where=" + JSON.stringify({
      onWhatBike: {
        __type: "Pointer",
        className: "Bike",
        objectId: this.bikeId
      }
    });

  },


  initialize(models, options) {
    this.bikeId = options && options.bikeId;
    console.log(options);
  },

  parse(response) {
    return response.results;

  }
});

export default ComponentsCollection;
