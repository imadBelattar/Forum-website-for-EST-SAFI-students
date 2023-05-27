const { getTags } = require("../controllers/tagController");
const express = require("express");
const tagRouter = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

tagRouter.get("/getTags",verifyJWT, getTags);

module.exports = tagRouter;
