const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/userRoute");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT | 5000;

app.use(express.json());
app.use(cors());
app.use(routes);

//console.log(process.env.MONGO_URI);

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("estForum database connection established successfully")
  )
  .catch((err) => console.log(`Error connecting to estForum : ${err}`));

app.listen(PORT, () => console.log(`Listening at ${PORT}`));
