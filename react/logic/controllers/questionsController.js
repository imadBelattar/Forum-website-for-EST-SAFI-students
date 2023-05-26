const userModel = require("../models/userModel");
const questionModel = require("../models/questionModel");

//invoked by a HTTP POST request
const addQuestion = async (req, res) => {
  try {
    // Define the question object
    const question = new questionModel({
      title: "Sample Question 2",
      description:
        "This is another question please guys provide a couple of solutions?",
      tags: ["sample", "question", "python"],
      user: req.user._id, // Assuming you have the authenticated user's ObjectId available in req.user._id
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: [],
    });

    // Save the question in the database
    const savedQuestion = await question.save();
    return res.status(201).json({
      savedQuestion,
      message: "your question has been saved successfully !",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save question", err });
  }
};

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
