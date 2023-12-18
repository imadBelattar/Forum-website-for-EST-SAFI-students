const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [String],
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
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  screenshots: [String],
  views: {
    type: Number,
    default: 0,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  acceptedAnswers: {
    type: Number,
    default: 0,
  },
});

const questionModel = mongoose.model("Question", questionSchema, "question");

module.exports = questionModel;
