const mongoose = require("mongoose");

// Define the tag schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    default: "#000000",
  },
});

// Create the tag model
const tagModel = mongoose.model("Tag", tagSchema, "tags");

module.exports = tagModel;
