const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
  email: {
    required: true,
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Please enter a valid email",
    },
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  let foundUser;
  return this.findOne({ email })

    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect email or password"));
      }
      if (!password) {
        return Promise.reject(new Error("incorrect email or password"));
      }
      foundUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("incorrect email or password"));
      }
      return foundUser;
    });
};

module.exports = mongoose.model("user", userSchema);
