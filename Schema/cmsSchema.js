const mongoose = require("mongoose");

const CmsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  descrtption: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Cms", CmsSchema);
