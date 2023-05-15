const userModel = require("../models/userModel");

// Get all users
const getUsers = async (req, res) => {
 /*  const users = await userModel.find();
  res.send(users); */
  res.send("returning the users !!!");
};

module.exports = {getUsers};
