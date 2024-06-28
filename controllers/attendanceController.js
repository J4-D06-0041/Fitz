const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");

class AttendanceController {
  constructor() {}

  async logAttendance(userId, loginTime, logoutTime, totalTime, phTimeLogin, phTimeLogout, dateCreated, dateUpdated) {
    return new Promise(async (resolve, reject) => {
      try {
        const attendance = new Attendance({
          user: userId,
          loginTime,
          logoutTime,
          totalTime,
          phTimeLogin,
          phTimeLogout,
          dateCreated,
          dateUpdated,
        });

        await attendance.save();

        resolve(attendance);
      } catch (err) {
        console.error(err.message);
        reject(err);
      }
    });
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
