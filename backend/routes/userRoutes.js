const express = require("express");
const {
  passwordLogin,
  microsoftLogin,
  getUserById,
  getUsers,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", passwordLogin);
router.post("/login/microsoft", microsoftLogin);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserProfile);

module.exports = router;
