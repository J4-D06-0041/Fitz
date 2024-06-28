const express = require("express");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/private/dashboard.html"));
});

module.exports = router;
