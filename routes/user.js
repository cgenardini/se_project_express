const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/user");

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post("/", createUser);

module.exports = router;
