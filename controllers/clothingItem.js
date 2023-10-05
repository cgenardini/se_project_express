const ClothingItem = require("../models/clothingItem");
const { serverError, invalidData, notFound } = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .then((clothingItem) => res.status(200).send(clothingItem))
    .catch((err) => {
      console.error(err.name, err.message);
      if (err.name === "ValidationError") {
        res.status(invalidData).send(`data not valid: ${err.message}`);
      }
      res
        .status(notFound)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(200).send(clothingItem))
    .catch((err) => {
      console.error(err.name, err.message);
      if (err.name === "ValidationError") {
        return res
          .status(invalidData)
          .send({ message: `this data is not valid: ${err.message}` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID format" });
      }
      res
        .status(notFound)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const itemId = req.params.itemId;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((clothingItem) => {
      if (!clothingItem) {
        return res.status(notFound).send({ message: "Item not found" });
      }
      res
        .status(200)
        .send({ message: `${clothingItem} was deleted successfully` });
    })
    .catch((err) => {
      console.error(err.name, err.message);

      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      res
        .status(notFound)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports.likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.status(200).send({ data: clothingItem });
    })
    .catch((err) => {
      console.error(err.name, err.message);
      if (err.name === "ValidationError") {
        return res
          .status(invalidData)
          .send({ message: `this data is not valid: ${err.message}` });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      res
        .status(serverError)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};

module.exports.unlikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.status(200).send({ data: clothingItem });
    })
    .catch((err) => {
      console.error(err.name, err.message);
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      res
        .status(serverError)
        .send({ message: `There has been a server error: ${err.message} ` });
    });
};
