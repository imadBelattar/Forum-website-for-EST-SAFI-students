const userModel = require("../models/userModel");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content, it's nice
  const refreshToken = cookies.jwt;
  const foundUser = await userModel.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204); //it's good as well
  }
  const updatedUser = await userModel.findOneAndUpdate(
    { login: foundUser.login },
    { refreshToken: "" },
    { new: true }
  );
  console.log(updatedUser);
  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.sendStatus(204);
};
module.exports = { handleLogout };
