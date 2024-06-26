const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loginTime: {
    type: Date,
    required: true,
  },
  logoutTime: {
    type: Date,
  },
  totalTime: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  dateUpdated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
