const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  screenshots: [String],
  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const answerModel = mongoose.model("Answer", answerSchema, "answer");

module.exports = answerModel;
