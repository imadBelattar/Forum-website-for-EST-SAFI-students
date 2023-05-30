const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");

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
    const { id } = req.params; // Get the question ID from the request parameters
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

module.exports = {
  addQuestion,
  getAllQuestions,
  getAllQuestionsByVotes,
  getAllQuestionsByViews,
  selectQuestion,
};
