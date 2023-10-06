const User = require("../models/user");
const { serverError, invalidData, notFound } = require("../utils/errors");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: `data not valid` });
      }
      return res
        .status(serverError)
        .send({ message: `There has been a server error ` });
    });
};
