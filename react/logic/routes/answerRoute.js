const express = require("express");
const answerRouter = express.Router();
const {
  isAnswerVoted,
  update_answer_votes,
} = require("../controllers/answerController");
const verifyJWT = require("../middleware/verifyJWT");

answerRouter.get("/isAnswerVoted/:answerId", verifyJWT, isAnswerVoted);
answerRouter.put("/answer/votes/:answerId", verifyJWT, update_answer_votes);
module.exports = answerRouter;
