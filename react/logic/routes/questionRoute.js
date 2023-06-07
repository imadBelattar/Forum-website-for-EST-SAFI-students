const express = require("express");
const questionRouter = express.Router();
const {
  addQuestion,
  getAllQuestions,
  getAllQuestionsByVotes,
  getAllQuestionsByViews,
  selectQuestion,
  updateQuestionvotes,
  getQuestionsByUser,
} = require("../controllers/questionsController");
const verifyJWT = require("../middleware/verifyJWT");
const { uploadForQuestion } = require("../middleware/multer");

questionRouter.post(
  "/addQuestion",
  verifyJWT,
  uploadForQuestion.array("image", 3),
  addQuestion
);
questionRouter.get("/getAllQuestions", verifyJWT, getAllQuestions);
questionRouter.get(
  "/getAllQuestionsByVotes",
  verifyJWT,
  getAllQuestionsByVotes
);
questionRouter.get(
  "/getAllQuestionsByViews",
  verifyJWT,
  getAllQuestionsByViews
);
questionRouter.get("/selectQuestion/:id", verifyJWT, selectQuestion);
questionRouter.put(
  "/increase/questionVotes/:questionId",
  verifyJWT,
  updateQuestionvotes
);
questionRouter.get("/userQuestions", verifyJWT, getQuestionsByUser);
module.exports = questionRouter;
