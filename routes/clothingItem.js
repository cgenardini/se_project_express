const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");

const userAuth = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", userAuth, validateClothingItemBody, createClothingItem);
router.delete("/:itemId", userAuth, validateId, deleteClothingItem);
router.put("/:itemId/likes", userAuth, validateId, likeClothingItem);
router.delete("/:itemId/likes", userAuth, validateId, unlikeClothingItem);

module.exports = router;
