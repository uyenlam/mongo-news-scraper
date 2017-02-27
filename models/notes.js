
// Require mongoose
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// new Schema: UserSchema
var savedSchema = new Schema({
  // notes: a trimmed, required string
  notes: {
    type: String,
    required: "Note content is required"
  },
  // noteCreated: the current date
  noteCreated: {
    type: Date,
    default: Date.now
  },

});

// Use the above schema to make the notes model/collection
var Notes = mongoose.model("notes", savedSchema);

// Export the model so the server can use it
module.exports = Notes;
