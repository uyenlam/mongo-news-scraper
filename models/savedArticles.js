
// Require mongoose
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// new Schema: UserSchema
var savedSchema = new Schema({
  // title: a trimmed, required string
  title: {
    type: String,
    trim: true,
    required: "Article title is required"
  },
  // link: a trimmed, required string
  link: {
    type: String,
    unique: true,
    required: "Link is Required"
  },
  // image: a string
  image:{
    type: String,
  },
  // text: a string
  text: {
    type: String,
  },
  // notes: associate the savedArticles model with the Notes model
  notes:{
    type: Schema.Types.ObjectId,
    ref: 'Notes'
  },
  // articleCreated: the current date
  articleCreated: {
    type: Date,
    default: Date.now
  },

});

// Use the above schema to make the savedData model/collection
var Articles = mongoose.model("savedData", savedSchema);

// Export the model so the server can use it
module.exports = Articles;
