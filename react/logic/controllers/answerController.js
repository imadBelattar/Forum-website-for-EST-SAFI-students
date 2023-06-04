const userModel = require("../models/userModel");
const answerModel = require("../models/answerModel");

const isAnswerVoted = async (req, res) => {
  const userId = req.user._id;
  const { answerId } = req.params;
  try {
    let vote_type = "default which is null";
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const answer = await answerModel.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "answer not found !" });
    }
    const votesNumber = answer.upvotes - answer.downvotes;
    if (user.upvotedAnswers.includes(answerId)) {
      vote_type = "upvoted answer";
      return res.status(200).json({
        message: "the answer is an already upvoted answer",
        vote_type,
        votesNumber,
      });
    } else if (user.downvotedAnswers.includes(answerId)) {
      vote_type = "downvoted answer";
      return res.status(200).json({
        message: "the answer is an already downvoted answer",
        vote_type,
        votesNumber,
      });
    } else {
      vote_type = "unvoted answer";
      return res
        .status(200)
        .json({ message: "the answer is unvoted yet", vote_type, votesNumber });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
const update_answer_votes = async (req, res) => {
  const { answerId } = req.params;
  const userId = req.user._id;
  const { action } = req.body;
  let feedback = "";

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const answer = await answerModel.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found!" });
    }

    switch (action) {
      case "upvote answer":
        if (user.downvotedAnswers.includes(answerId)) {
          user.downvotedAnswers.pull(answerId);
          answer.downvotes -= 1; // Decrease downvotes
        }
        if (!user.upvotedAnswers.includes(answerId)) {
          user.upvotedAnswers.push(answerId);
          answer.upvotes += 1; // Increase upvotes
          feedback = "Thanks for your feedback";
        }
        break;
      case "cancel upvoting":
        if (user.upvotedAnswers.includes(answerId)) {
          user.upvotedAnswers.pull(answerId);
          answer.upvotes -= 1; // Decrease upvotes
          feedback = "Upvoting cancelled";
        }
        break;
      case "downvote answer":
        if (user.upvotedAnswers.includes(answerId)) {
          user.upvotedAnswers.pull(answerId);
          answer.upvotes -= 1; // Decrease upvotes
        }
        if (!user.downvotedAnswers.includes(answerId)) {
          user.downvotedAnswers.push(answerId);
          answer.downvotes += 1; // Increase downvotes
          feedback = "Thanks for your feedback";
        }
        break;
      case "cancel downvoting":
        if (user.downvotedAnswers.includes(answerId)) {
          user.downvotedAnswers.pull(answerId);
          answer.downvotes -= 1; // Decrease downvotes
          feedback = "Downvoting cancelled";
        }
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    await Promise.all([user.save(), answer.save()]);
    res.status(200).json({ feedback });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  isAnswerVoted,
  update_answer_votes,
};
