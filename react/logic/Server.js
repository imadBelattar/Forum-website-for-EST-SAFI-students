const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT | 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
//server api routes
app.use("/api", require("./routes/logoutRoute"));
app.use("/api", userRoutes);
app.use("/api", require("./routes/refreshTokenRoute"));
//this is just for test the are cookies stored in browser
app.get("/api/testCookieALMIGHTY", (req, res) => {
  res.cookie("test", "tested-cookie", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    domain: "localhost",
  });
  res.status(201).json({ message: "I may sent a cookie included" });
});
//for undefined api routes :

app.get("*", (req, res) => {
  res.status(404).json({ message: "UNFOUND 404" });
});
app.post("*", (req, res) => {
  res.status(404).json({ message: "UNFOUND 404" });
});
//console.log(process.env.MONGO_URI);

// Connect to MongoDB database
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("estForum database connection established successfully")
  )
  .catch((err) => console.log(`Error connecting to estForum : ${err}`));

app.listen(PORT, () => console.log(`Listening at ${PORT}`));
