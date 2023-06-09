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
app.use("/api", userRoutes);
app.use("/api", require("./routes/questionRoute"));
app.use("/api", require("./routes/refreshTokenRoute"));
app.use("/api", require("./routes/logoutRoute"));
app.use("/api", require("./routes/tagRoute"));
app.use("/api", require("./routes/answerRoute"));
//for undefined api routes :

app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api/uploads")) {
    next();
  } else {
    res.status(404).json({ message: "UNFOUND 404" });
  }
});
app.post("*", (req, res) => {
  res.status(404).json({ message: "UNFOUND 404" });
});
//using uploads folder as static folder
app.use("/api/uploads", express.static("uploads"));
app.use("/api/uploadsForAnswer", express.static("uploads/answers-screenshots"));

console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("estForum database connection established successfully")
  )
  .catch((err) => console.log(`Error connecting to estForum : ${err}`));

app.listen(PORT, () => console.log(`Listening at ${PORT}`));
