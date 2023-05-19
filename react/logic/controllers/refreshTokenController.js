const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: "cookies or the jwt undefined" });
  // printing the jwt property on the console
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const foundUser = await userModel.findOne({ refreshToken });
  if (!foundUser)
    return res
      .sendStatus(403)
      .json({ message: "user with this refresh token not found" }); //forbidden
  userClone = {
    full_name: foundUser.full_name,
    login: foundUser.login,
    password: foundUser.password,
  };
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userClone.login != decoded.login) {
      return res.sendStatus(403);
    }
    const newAccessToken = jwt.sign(
      userClone,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "17s" }
    );
    res.json({ newAccessToken });
  });
};
module.exports = { handleRefreshToken };
