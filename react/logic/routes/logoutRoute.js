const express = require("express");
const logoutRouter = express.Router();
const { handleLogout } = require("../controllers/logoutController");


logoutRouter.get("/logout", handleLogout);

module.exports = logoutRouter;
