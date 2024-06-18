const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

// Route to get all users
router.get("/", authMiddleware, getAllUsers);

// Route to get a specific user by ID
router.get("/:id", authMiddleware, getUserById);

// Route to update user details
router.put("/:id", authMiddleware, updateUser);

// Route to delete a user
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
