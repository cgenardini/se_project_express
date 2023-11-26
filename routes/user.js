const router = require("express").Router();
const { getCurrentUser, editCurrentUser } = require("../controllers/user");
const { validateEditUserInfo } = require("../middlewares/validation");
const userAuth = require("../middlewares/auth");

router.get("/me", userAuth, getCurrentUser);

router.patch("/me", userAuth, validateEditUserInfo, editCurrentUser);

module.exports = router;
