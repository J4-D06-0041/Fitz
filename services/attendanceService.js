const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");
const logger = require("../logger");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

class AttendanceController {
  constructor() {}

  async logAttendance(attendanceObject) {
    try {
      logger.info("Received in logAttendance:", attendanceObject);
      const attendance = new Attendance({
        user: attendanceObject.user,
        clientLoginTime: attendanceObject.clientLoginTime,
        clientLogoutTime: attendanceObject.clientLogoutTime,
        userLoginTime: attendanceObject.userLoginTime,
        userLogoutTime: attendanceObject.userLogoutTime,
        dateCreated: attendanceObject.dateCreated,
        totalWorkTime: attendanceObject.totalWorkTime,
      });

      await attendance.save();
      logger.info("Attendance logged successfully:", attendance.toObject());
      return attendance.toObject(); // Returning the document directly
    } catch (err) {
      logger.error(err.stack);
      throw err; // Rethrow or handle as needed
    }
  }

  async getUserAttendance(req, res) {
    try {
      logger.info("Inside getUserAttendance");
      const token = req.cookies.token;
      logger.info(`token from getUserAttendance ${token}`);
      if (!token) {
        return res.status(401).send({ error: "No token provided" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info(`decoded from getUserAttendance ${JSON.stringify(decoded)}`);
        // return res.status(200).send(decoded);
        let userId = decoded.user.id;
        logger.info(`userId ${userId}`);
        try {
          // Ensure userId is an ObjectId
          const attendance = await Attendance.find({ user: new mongoose.Types.ObjectId(userId) })
            .limit(1)
            .sort({ dateCreated: -1 })
            .populate("user");
          logger.info(`attendance ${attendance}`);
          res.json(attendance);
        } catch (err) {
          logger.error(`Error fetching user attendance: ${err.message}`);
          res.status(500).send("Server error");
        }
      } catch (error) {
        logger.error(`error from getUserAttendance ${error}`);
        return res.status(401).send({ error: "Invalid token" });
      }
    } catch (error) {
      logger.error(`error from getUserAttendance ${error}`);
      return res.status(500).send({ error: "Server error" });
    }
  }
}

module.exports = new AttendanceController();
