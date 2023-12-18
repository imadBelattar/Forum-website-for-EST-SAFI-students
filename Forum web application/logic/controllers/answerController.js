const userModel = require("../models/userModel");
const answerModel = require("../models/answerModel");
const questionModel = require("../models/questionModel");

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

const postQuestion = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;
    const { questionId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found !" });
    }
    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "question not found !" });
    }
    const images = req.files;
    const imagesPaths = [];

    for (let i = 0; i < images.length; i++) {
      const path = images[i].path;
      imagesPaths.push(path);
    }
    const answer = new answerModel({
      content,
      user: userId,
      screenshots: imagesPaths,
    });
    const savedAnswer = await answer.save();
    question.answers.push(savedAnswer._id);
    await question.save();
    return res.status(201).json({
      message: "your answer has been posted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save answer", err });
  }
};
const checkAnswer = async (req, res) => {
  const answerId = req.body.id;
  const { questionId } = req.body;
  const { isAccepted } = req.body;
  if (!isAccepted) {
    return res.status(500).json({ message: "more information is required !" });
  }
  try {
    const answer = await answerModel.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "answer not found !" });
    }
    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "question not found !" });
    }
    if (isAccepted === "accepted") {
      answer.isAccepted = true;
      question.isAnswered = true;
      question.acceptedAnswers++;
      await answer.save();
      await question.save();
      return res.status(201).json({ feedback: "Answer accepted successfully" });
    } else if (isAccepted === "canceled") {
      answer.isAccepted = false;
      if (question.acceptedAnswers > 0) question.acceptedAnswers--;
      if (question.acceptedAnswers === 0) question.isAnswered = false;
      await answer.save();
      await question.save();
      return res
        .status(201)
        .json({ feedback: "You have revoked the acceptance of this answer" });
    }
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  isAnswerVoted,
  update_answer_votes,
  postQuestion,
  checkAnswer,
};
