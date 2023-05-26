const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
// Get all users
const getUsers = async (req, res) => {
  const users = await userModel.find();
  res.json(users);
};
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// User authentication
const authentication = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password)
    return res.status(400).json({ message: "login and password required !" });
  try {
    // Check if the user exists in the database
    const user = await userModel.findOne({ login });
    if (!user) {
      return res.status(404).json({
        message: `User not found`,
      });
    }
    // Validate the password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    userClone = { _id: user._id, fullName: user.full_name, login, password };
    // User authentication successful
    const accessToken = generateAccessToken(userClone);
    const refreshToken = generateRefreshToken(userClone);
    // Update the user's refresh token attribute in the database
    await userModel.updateOne({ login }, { refreshToken });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Authentication successful",
      accessToken,
      name: userClone.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error occured" });
  }
};

module.exports = { authentication, getUsers };
