const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authService = require("../services/authService")
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
  try {
    await authService.register(req.body, res);
  } catch (error) {
    logger.error("Error registering user:", error);
    res.status(500).json({ msg: "Server error" });
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

router.get("/register", authMiddleware, (req, res )=>{
  res.sendFile(path.join(__dirname, "../public/pages/public/register.html"));
});

router.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/private/logout.html"));
});

router.get("/logoutuser", (req, res) => {
  logger.info("inside logoutuser");

  // Decode the token to log it or use its data before clearing it
  const token = req.cookies.token;
  if (token) {
    const decodedToken = jwt.decode(token);
    logger.info('Decoded token:', decodedToken);
  } else {
    logger.info('No token found to decode');
  }

  req.session.destroy((err) => {
    if (err) {
      logger.error("Session destruction failed:", err);
      return res.status(500).send('Failed to logout');
    }

    logger.info('Deleting cookie');
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    logger.info('Cookie set to expire at:', twoHoursAgo);

    // Clear the cookie by setting an expired date
    res.cookie('token', '', { expires: twoHoursAgo, httpOnly: true, secure: true, path: '/' });
    logger.info('Redirecting to home');

    res.redirect('/'); // Redirect to the login page or home page
  });
});

router.get('/set-cookie', (req, res) => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  res.cookie('token', '', { expires: twoHoursAgo, httpOnly: true, secure: false, path: '/' });
  res.send('Cookie has been set to expire 2 hours ago');
});

// router.get("/validate-token", (req, res) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({ valid: false, msg: "No token provided" });
//   }

//   try {
//     let tokenValidate = jwt.verify(token, process.env.JWT_SECRET);
//     logger.info('tokenValidate', tokenValidate);
//     res.json({ valid: true });
//   } catch (error) {
//     res.status(401).json({ valid: false, msg: "Invalid token" });
//   }
// });

router.get("/validate-token", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ valid: false, msg: "No token provided" });
  }

  try {
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Token validated successfully:', decodedToken);

    // Convert Unix timestamps to human-readable format
    const readableIAT = new Date(decodedToken.iat * 1000).toLocaleString(); // Converts Issued At to readable date
    const readableEXP = new Date(decodedToken.exp * 1000).toLocaleString(); // Converts Expiration Time to readable date

    logger.info(`iat  ${readableIAT}`);
    logger.info(`exp, ${readableEXP}`);

    res.json({
      valid: true,
      iat: readableIAT,
      exp: readableEXP
    });
  } catch (error) {
    logger.error('Error validating token:', error.message);
    return res.status(401).json({
      valid: false,
      msg: error instanceof jwt.TokenExpiredError ? "Token has expired" : "Invalid token"
    });
  }
});

module.exports = router;
