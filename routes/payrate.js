const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { addPayrate, getPayrateByUserId, updatePayrate } = require("../services/payrateService");

// Route to add a new pay rate
router.post("/", authMiddleware, addPayrate);

// Route to get pay rate by user ID
router.get("/:userId", authMiddleware, getPayrateByUserId);

// Route to update pay rate for a user
router.put("/:userId", authMiddleware, updatePayrate);

module.exports = router;
