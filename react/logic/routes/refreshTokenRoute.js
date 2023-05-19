const express = require("express");
const refreshTokenRouter = express.Router();
const { handleRefreshToken } = require("../controllers/refreshTokenController");


refreshTokenRouter.get("/refreshToken", handleRefreshToken);

module.exports = refreshTokenRouter;
