const User = require("../models/user");
const { serverError, invalidData, notFound } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => {
      console.error(err.name, err.message);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      res
        .status(serverError)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.error(err.name, err.message);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      res
        .status(serverError)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err.name, err.message);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      res
        .status(serverError)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};
