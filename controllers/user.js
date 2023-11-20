const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const User = require("../models/user");

const BadRequestError = require("../utils/errors/badRequestError");
const ConflictError = require("../utils/errors/conflictError");
const ForbiddenError = require("../utils/errors/forbiddenError");
const NotFoundError = require("../utils/errors/notFoundError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");

const {
  serverError,
  invalidData,
  notFound,
  authError,
  conflictError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("email already exists");
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
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      }

      if (err.name === "ValidationError" || err.message === "data not valid") {
        next(new BadRequestError("data not valid"));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
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
        next(new UnauthorizedError("incorrect email or password"));
      } else next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("user not found");
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      } else next(err);
    });
};

module.exports.editCurrentUser = (req, res, next) => {
  const { avatar, name } = req.body;
  const { _id } = req.user;

  User.findOneAndUpdate(
    { _id },
    { avatar, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("user not found");
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("data not valid"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      } else next(err);
    });
};
