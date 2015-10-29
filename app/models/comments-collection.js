import Comment from './comment';

var CommentsCollection = Backbone.Collection.extend({
  model: Comment,
  url() {
    return "https://api.parse.com/1/classes/Comment?include=creator,recipe&where=" + JSON.stringify({
      recipe: {
        __type: "Pointer",
        className: "Recipe",
        objectId: this.recipeId
      }
    });
  },

  initialize(options) {
    this.recipeId = options.recipeId;
  },

  parse(response) {
    return response.results;
  }
});

export default CommentsCollection;
