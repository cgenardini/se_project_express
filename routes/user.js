const router = require("express").Router();
const { getCurrentUser, editCurrentUser } = require("../controllers/user");
const {
  validateUserInfoBody,
  validateId,
  validateUserLogIn,
} = require("../middlewares/validation");
const userAuth = require("../middlewares/auth");

router.get("/me", userAuth, getCurrentUser);

router.patch("/me", userAuth, validateUserInfoBody, editCurrentUser);

module.exports = router;
