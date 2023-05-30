const express = require("express");
const questionRouter = express.Router();
const {
  addQuestion,
  getAllQuestions,
  getAllQuestionsByVotes,
  getAllQuestionsByViews,
  selectQuestion,
} = require("../controllers/questionsController");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../middleware/multer");

questionRouter.post(
  "/addQuestion",
  verifyJWT,
  upload.array("image", 3),
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

module.exports = questionRouter;
