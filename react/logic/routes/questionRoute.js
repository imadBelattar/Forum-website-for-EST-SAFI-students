const express = require("express");
const questionRouter = express.Router();
const {
  addQuestion,
  getAllQuestions,
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

module.exports = questionRouter;
