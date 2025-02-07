const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/:username", getUserByUsername);
router.put("/:username", updateUser);
router.delete("/:username", deleteUser);
router.post("/toggle-status", toggleUserStatus);

module.exports = router;
