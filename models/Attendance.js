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
  phTime: {
    type: Date,
    required: true,
  },
  // dateCreated: {
  //   type: Date,
  //   required: true,
  //   default: Date.now,
  // },
  // dateUpdated: {
  //   type: Date,
  //   required: true,
  //   default: Date.now,
  // },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
