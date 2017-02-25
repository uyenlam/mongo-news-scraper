
// Require mongoose
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// new Schema: UserSchema
var savedArticlesSchema = new Schema({
  // title: a trimmed, required string
  title: {
    type: String,
    trim: true,
    unique: true,
    required: "Article title is required"
  },
  // link: a trimmed, required string
  link: {
    type: String,
    trim: true,
    unique: true,
    required: "Link is Required"
  },
  // text: a trimmed, required string
  text: {
    type: String,
    trim: true,
  },

  // articleCreated: the current date
  articleCreated: {
    type: Date,
    default: Date.now
  },

});

// Use the above schema to make the savedArticles model
var savedData = mongoose.model("savedArticles", savedArticlesSchema);

// Export the model so the server can use it
module.exports = savedData;
