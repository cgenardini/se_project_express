const router = require("express").Router();
const { getCurrentUser, editCurrentUser } = require("../controllers/user");
const userAuth = require("../middlewares/auth");

router.get("/me", userAuth, getCurrentUser);

router.patch("/me", userAuth, editCurrentUser);

module.exports = router;
