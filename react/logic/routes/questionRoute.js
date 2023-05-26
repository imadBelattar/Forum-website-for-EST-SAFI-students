const express = require("express");
const questionRouter = express.Router();
const {
  addQuestion,
  getAllQuestions,
} = require("../controllers/questionsController");
const verifyJWT = require("../middleware/verifyJWT");

questionRouter.post("/addQuestion", verifyJWT, addQuestion);
questionRouter.get("/getAllQuestions", verifyJWT, getAllQuestions);

module.exports = questionRouter;
