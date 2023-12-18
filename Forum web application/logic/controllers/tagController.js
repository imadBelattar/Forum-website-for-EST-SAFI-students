const tagModel = require("../models/tagModel");

const getTags = async (req, res) => {
  try {
    const tags = await tagModel.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tags", error });
  }
};

module.exports = { getTags };
