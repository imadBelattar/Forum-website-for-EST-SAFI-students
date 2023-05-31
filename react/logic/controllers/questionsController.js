const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");
const userModel = require("../models/userModel");

//invoked by a HTTP POST request
const addQuestion = async (req, res) => {
  try {
    // Extract the data from the request body
    const { title, description, selectedTags } = req.body;
    const tags = JSON.parse(selectedTags);
    // Process the image files
    const imageFiles = req.files;
    const imagePaths = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i].path;
      imagePaths.push(imagePath);
    }

    // Create the question object with the received data
    const question = new questionModel({
      title,
      description,
      tags,
      user: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: [],
      screenshots: imagePaths, // Store the image paths in the question object
    });

    // Save the question in the database
    const savedQuestion = await question.save();

    return res.status(201).json({
      savedQuestion,
      message: "Your question has been saved successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save question", err });
  }
};
//default is sorting by createdAt property
const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionModel.find().sort({ createdAt: -1 }); // Sort by created date, latest first
    return res.status(200).json(questions);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving questions" });
  }
};
//questions retrieved sorting by votes
const getAllQuestionsByVotes = async (req, res) => {
  try {
    const questions = await questionModel.aggregate([
      {
        $addFields: {
          voteDifference: { $subtract: ["$upvotes", "$downvotes"] },
        },
      },
      {
        $sort: { voteDifference: -1 }, // Sort by vote difference, highest first
      },
    ]);

    return res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving questions Oops!" });
  }
};
//questions retrieved sorting by views
const getAllQuestionsByViews = async (req, res) => {
  try {
    const questions = await questionModel.find().sort({ views: -1 }); // Sort by created date, latest first
    return res.status(200).json(questions);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving questions" });
  }
};

//return a question when the user selected it using the ID
const selectQuestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let voted = {};
    const { id } = req.params; // Get the question ID from the request parameters
    if (user.upvotedQuestions.includes(id)) {
      voted.votting_type = "already upvoted";
    } else if (user.downvotedQuestions.includes(id)) {
      voted.votting_type = "already downvoted";
    }
    const question = await questionModel
      .findById(id)
      .populate("user", "full_name-_id") // Populate the user field with the full_name
      .lean(); // Convert the Mongoose document to a plain JavaScript object
    if (!question) {
      return res.status(404).json({ error: "Question not found", id: id });
    }

    // Find the answers for the question and populate the user field with the full_name
    const answers = await answerModel
      .find({ _id: { $in: question.answers } })
      .populate("user", "full_name-_id") // Populate the user field with the full_name
      .lean(); // Convert the Mongoose documents to plain JavaScript objects

    // Prepare the response object with the question and its answers
    const response = {
      voted,
      question: {
        _id: question._id,
        title: question.title,
        description: question.description,
        question_creator: question.user.full_name,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        upvotes: question.upvotes,
        downvotes: question.downvotes,
        screenshots: question.screenshots,
        tags: question.tags,
        views: question.views,
      },
      answers: answers.map((answer) => ({
        _id: answer._id,
        content: answer.content,
        answer_creator: answer.user.full_name,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
      })),
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the question" });
  }
};

//I was lazy to create multiple functions to handle the votting process
//update the votes
const updateQuestionvotes = async (req, res) => {
  const vote_type = req.body.vote_type;
  if (!vote_type) {
    return res.status(400).json({ message: "No voting type is found!" });
  }
  const userId = req.user._id;
  const { questionId } = req.params; // Extract the questionId from req.params
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the question by its id
    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    let feedback;
    switch (vote_type) {
      case "upvote":
        if (user.downvotedQuestions.includes(questionId)) {
          user.downvotedQuestions.pull(questionId);
          question.downvotes -= 1; // Decrease downvotes by 1
        }
        question.upvotes += 1; // Increase upvotes by 1
        user.upvotedQuestions.push(questionId);
        feedback = "Thanks for your feedback!";
        break;

      case "downvote":
        if (user.upvotedQuestions.includes(questionId)) {
          user.upvotedQuestions.pull(questionId);
          question.upvotes -= 1; // Decrease downvotes by 1
        }
        question.downvotes += 1; // Increase downvotes by 1
        user.downvotedQuestions.push(questionId);
        feedback = "Thanks for your feedback!";
        break;

      case "remove upvote":
        if (user.upvotedQuestions.includes(questionId)) {
          user.upvotedQuestions.pull(questionId);
          question.upvotes -= 1; // Decrease upvotes by 1
          feedback = "You have canceled upvoting this question";
        } else {
          feedback = "Question was not upvoted by you";
        }
        break;

      case "remove downvote":
        if (user.downvotedQuestions.includes(questionId)) {
          user.downvotedQuestions.pull(questionId);
          question.downvotes -= 1; // Decrease downvotes by 1
          feedback = "You have canceled downvoting this question";
        } else {
          feedback = "Question was not downvoted by you";
        }
        break;

      default:
        return res
          .status(400)
          .json({ message: "Invalid vote_type", vote_type });
    }
    // Save the updated question
    await question.save();
    // Save the updated user document
    await user.save();
    const message = "Upvoted successfully!";
    return res.status(200).json({ message, feedback });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  addQuestion,
  getAllQuestions,
  getAllQuestionsByVotes,
  getAllQuestionsByViews,
  selectQuestion,
  updateQuestionvotes,
};
