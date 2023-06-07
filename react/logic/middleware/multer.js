// multer.js
const multer = require("multer");
const path = require("path");

// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Replace 'uploads/' with the actual directory path where you want to store the files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/answers-screenshots"); // Replace 'uploads/' with the actual directory path where you want to store the files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName =
      "answer-" + file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

// Create the multer instance with the configured storage
const uploadForQuestion = multer({ storage: storage });
const uploadForAnswer = multer({ storage: storage2 });

// Export the upload instance
module.exports = { uploadForQuestion, uploadForAnswer };
