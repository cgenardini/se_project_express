const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  serverError,
  invalidData,
  notFound,
  authError,
  conflictError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(serverError)
        .send({ message: `There has been a server error ` }),
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error("email already exists"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      }),
    )
    .then((user) => {
      const updatedUser = user.toObject();
      delete updatedUser.password;

      return res.send({ data: updatedUser });
    })

    .catch((err) => {
      if (err.code === 11000 || err.message === "email already exists") {
        return res
          .status(conflictError)
          .send({ message: "email already exists" });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }

      if (err.name === "ValidationError" || err.message === "data not valid") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "incorrect email or password") {
        return res
          .status(authError)
          .send({ message: "incorrect email or password" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: "user not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
    });
};

module.exports.editCurrentUser = (req, res) => {
  const { email, avatar, name, _id } = req.user;

  User.findOneAndUpdate({ _id }, { email, avatar, name })
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: "user not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res.status(serverError).send({ message: "server error" });
    });
};
