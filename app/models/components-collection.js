import Component from './component';

var ComponentsCollection = Backbone.Collection.extend({
  model: Component,
  url(){

    // "https://api.parse.com/1/classes/Component?include=creator,bike&bikeId=" + this.bikeId
    return "https://api.parse.com/1/classes/Component?include=creator,bike&where=" + JSON.stringify({
      onWhatBike: this.bikeId ? {
        __type: "Pointer",
        className: "Bike",
        objectId: this.bikeId
      } : null
    });

  },


  initialize(models, options) {
    this.bikeId = options && options.bikeId;
    console.log(options)
  },

  parse(response) {
    return response.results;

  }
});

export default ComponentsCollection;
