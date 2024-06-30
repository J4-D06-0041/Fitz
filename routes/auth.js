const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const AuthService = require("../services/authService");
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
      await AuthService.register(firstName, lastName, email, role, username, password, userTimezone, clientTimezone);

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
      let clientTimeZone = user.clientTimezone;
      let clientTime = moment().utc().add(clientTimeZone, "hours").toISOString();
      let userTimeZone = user.userTimezone;
      let userTime = moment().utc().add(userTimeZone, "hours").toISOString();

      const attendance = {
        user: user._id,
        clientLoginTime: clientTime,
        userLoginTime: userTime,
      };
      let attendanceResponse = await attendanceService.logAttendance(attendance);

      const payload = {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          username: user.username,
          userTimezone: user.userTimezone,
          clientTimezone: user.clientTimezone,
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

  try {
    let user = await userService.getUserByUsername(username);

    if (!user) {
      logger.info("User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const attendance = await attendanceService.getUserAttendance(user._id);
    if (!attendance) {
      logger.info("No attendance record found for user:", user.id);
      return res.status(400).json({ msg: "No attendance record found" });
    }
    logger.info("Attendance record found:", attendance);

    // add logout time
    let clientTimeZone = user.clientTimezone;
    let clientLogoutTime = moment().utc().add(clientTimeZone, "hours").toISOString();
    let userTimeZone = user.userTimezone;
    let userLogoutTime = moment().utc().add(userTimeZone, "hours").toISOString();

    logger.info("clientLogoutTime:", clientLogoutTime);
    logger.info("userLogoutTime:", userLogoutTime);

    // Calculate total time
    const loginTime = moment(attendance.userLoginTime);
    const logoutTime = moment(userLogoutTime);
    const totalTime = moment.duration(logoutTime.diff(loginTime)).asHours();

    logger.info("Calculated totalTime:", totalTime);

    attendance = {
      user: user._id,
      clientLogoutTime: clientLogoutTime,
      userLogoutTime: userLogoutTime,
      totalWorkTime: totalTime
    };
    let attendanceResponse = await attendanceService.logAttendance(attendance);

    await attendance.save();

    console.log("Updated attendance record:", attendance);


    res.json({ msg: "User logged out successfully" });

   
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


router.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/private/logout.html"));
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
