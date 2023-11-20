const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/errors/badRequestError");
const ConflictError = require("../utils/errors/conflictError");
const ForbiddenError = require("../utils/errors/forbiddenError");
const NotFoundError = require("../utils/errors/notFoundError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");

const {
  serverError,
  invalidData,
  notFound,
  forbiddenError,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})

    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch(next);
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`this data is not valid`));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id } = req.user;

  ClothingItem.findById(itemId)

    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== _id.toString()) {
        throw new ForbiddenError("permission error");
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "item was deleted successfully" }),
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Id"));
      } else next(err);
    });
};

module.exports.likeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("this data is not valid"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      } else next(err);
    });
};

module.exports.unlikeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      } else next(err);
    });
};
