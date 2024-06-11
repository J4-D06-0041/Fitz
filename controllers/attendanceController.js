const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");

exports.logAttendance = async (req, res) => {
  const { loginTime, logoutTime } = req.body;

  try {
    const duration = moment(logoutTime).diff(moment(loginTime), "hours");

    const attendance = new Attendance({
      user: req.user.id,
      loginTime,
      logoutTime,
      duration,
    });

    await attendance.save();

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.userId }).populate("user", ["username"]);
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTeamAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("user", ["username"]);
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
