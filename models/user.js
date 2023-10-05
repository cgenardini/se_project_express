const mongoose = require("mongoose");
const validator = require("validator");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: "Please enter a valid url",
    },
  },
});

module.exports = mongoose.model("user", user);
