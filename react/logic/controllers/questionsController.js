const userModel = require("../models/userModel");
const questionModel = require("../models/questionModel");

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
    const { skip } = req.query || 0; // Number of questions to skip

    const questions = await questionModel
      .find()
      .sort({ createdAt: -1 }) // Sort by created date, latest first
      .skip(parseInt(skip)) // Skip questions based on the provided skip value
      .limit(100); // Limit the number of questions per batch

    return res.status(200).json(questions);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving questions" });
  }
};

module.exports = { addQuestion, getAllQuestions };
