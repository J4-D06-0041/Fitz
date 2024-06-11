const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  loginTime: {
    type: Date,
  },
  logoutTime: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
