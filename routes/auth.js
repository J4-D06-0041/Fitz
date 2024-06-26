const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const userController = require("../controllers/userController");

// Register a new user
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, role, timezone, username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    try {
      let userToSave = new User({ firstName, lastName, email, role, timezone, username, password });
      let savedUser = await userController.addUser(userToSave);
      res.json({ msg: "User registered successfully" });
    } catch (error) {
      res.status(500).send(`Server error ${error}`);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server error ${err}`);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("login", username, password);

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //add login time
    //add entry to attendance table

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Registration page
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/register.html"));
});

router.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/logout.html"));
});

module.exports = router;
