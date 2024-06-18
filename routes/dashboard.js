const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/dashboard.html"));
});

module.exports = router;
