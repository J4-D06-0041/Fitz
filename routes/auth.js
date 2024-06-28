const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const userService = require("../services/userService");
const Attendance = require("../models/Attendance");
const moment = require("moment-timezone");
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../logger");
let attendanceService = require("../services/attendanceService");
const mongoose = require("mongoose");

// Register a new user
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, role, username, password, userTimezone, clientTimezone } = req.body;

  try {
    let user = await userService.getUserByUsername(username);

    if (user) {
      return res.status(400).send({ msg: "User already exists" });
    }
    try {
      let userToSave = { firstName, lastName, email, role, username, password, userTimezone, clientTimezone };
      let savedUser = await userService.addUser(userToSave);

      res.status(200).send({ msg: "User registered successfully" });
    } catch (error) {
      logger.error("inside trycatch", error);
      res.status(500).send(`Server error ${error}`);
    }
  } catch (err) {
    logger.error("auth.js", err);
    res.status(500).send(`Server error ${err}`);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("login", username, password);

  try {
    let user = await userService.getUserByUsername(username);

    if (!user) {
      return res.status(401).send("Invalid credentials");
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send("Invalid credentials");
      }
      //add login time
      let currentTime = moment().utc().toISOString();
      let clientTimeZone = user.clientTimezone;
      let clientTime = moment().utc().add(clientTimeZone, "hours").toISOString();
      let userTimeZone = user.userTimezone;
      let userTime = moment().utc().add(userTimeZone, "hours").toISOString();
      let localTime = moment().tz("Asia/Singapore").add(8, "hours").toISOString();

      const attendance = {
        user: user._id,
        clientLoginTime: clientTime,
        userLoginTime: userTime,
      };
      let attendanceResponse = await attendanceService.logAttendance(attendance);

      const payload = {
        user: {
          id: user._id,
          role: user.role,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          return res.status(500).send("Server Error");
        }
        res.cookie("token", token, { httpOnly: true, secure: true }); // secure: true should be used in production with HTTPS
        return res.status(200).json({ token });
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send("Server Error", err);
  }
});

//logout
router.post("/logout", authMiddleware, async (req, res) => {
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
    const phTimeLogout = moment().tz("Asia/Singapore").add(8, "hours").format("YYYY-MM-DD HH:mm:ss");
    const tzConverter = -8;
    const userTimeLogout = moment()
      .utcOffset(userOffset * 60)
      .subtract(tzConverter, "hours")
      .format("YYYY-MM-DD HH:mm:ss");

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
  res.sendFile(path.join(__dirname, "../public/pages/public/register.html"));
});

router.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/logout.html"));
});

router.get("/validate-token", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ valid: false, msg: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, msg: "Invalid token" });
  }
});

module.exports = router;
