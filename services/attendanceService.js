const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");
const logger = require("../logger");

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

  async getUserAttendance(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const attendance = await Attendance.find({ user: userId }).populate("user", ["username"]);
        res.json(attendance);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    });
  }
}

module.exports = new AttendanceController();
