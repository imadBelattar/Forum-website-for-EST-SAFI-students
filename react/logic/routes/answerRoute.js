const express = require("express");
const answerRouter = express.Router();
const {
  isAnswerVoted,
  update_answer_votes,
  postQuestion,
  checkAnswer,
} = require("../controllers/answerController");
const verifyJWT = require("../middleware/verifyJWT");
const { uploadForAnswer } = require("../middleware/multer");

answerRouter.get("/isAnswerVoted/:answerId", verifyJWT, isAnswerVoted);
answerRouter.put("/answer/votes/:answerId", verifyJWT, update_answer_votes);
answerRouter.post(
  "/postAnswer",
  verifyJWT,
  uploadForAnswer.array("image", 3),
  postQuestion
);
answerRouter.put("/answer/isAccepted", verifyJWT, checkAnswer);
module.exports = answerRouter;
