const express = require("express");
const { devLogin, getUserById, getUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/login", devLogin);
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
