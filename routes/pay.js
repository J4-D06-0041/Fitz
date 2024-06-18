const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/pay.html"));
});

module.exports = router;
