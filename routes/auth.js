const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const userController = require("../controllers/userController");
const Attendance = require("../models/Attendance");
const moment = require("moment-timezone");

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
    const userOffset = user.timezone;
    const phTimeLogin = moment().tz('Asia/Singapore').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const tzConverter =- 8;
    const userTimeLogin = moment().utcOffset(userOffset * 60).subtract(tzConverter, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const attendance = new Attendance({
      user: user.id,
      loginTime: userTimeLogin,
      phTimeLogin: phTimeLogin,
      logoutTime: null,
      phTimeLogout: null,
      totalTime: 0,
    });


    //add entry to attendance table
    await attendance.save();
    
    console.log("Updated attendance record:", attendance);

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
    console.log(err);
    res.status(500).send("Server Error");
    
  }
});

//logout
router.post("/logout", async (req, res) => {
  const { username } = req.body;
  console.log("logout", username);

  try {
    let user = await User.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const attendance = await Attendance.findOne({ user: user.id, logoutTime: null });
    if (!attendance) {
      console.log("No attendance record found for user:", user.id);
      return res.status(400).json({ msg: "No attendance record found" });
    }
    console.log("Attendance record found:", attendance);

    // add logout time
    const userOffset = user.timezone;
    const phTimeLogout = moment().tz('Asia/Singapore').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const tzConverter =- 8;
    const userTimeLogout = moment().utcOffset(userOffset * 60).subtract(tzConverter, 'hours').format('YYYY-MM-DD HH:mm:ss');

    console.log("phTimeLogout:", phTimeLogout);
    console.log("userTimeLogout:", userTimeLogout);

    // Calculate total time
    const loginTime = moment(attendance.loginTime);
    const logoutTime = moment(userTimeLogout);
    const totalTime = moment.duration(logoutTime.diff(loginTime)).asHours();

    console.log("Calculated totalTime:", totalTime);

    attendance.logoutTime = userTimeLogout;
    attendance.phTimeLogout = phTimeLogout;
    attendance.totalTime = totalTime;
    
    await attendance.save();

    console.log("Updated attendance record:", attendance);


    res.json({ msg: "User logged out successfully" });
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
