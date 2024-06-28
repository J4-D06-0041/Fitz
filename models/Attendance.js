const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientLoginTime: {
    type: Date,
    required: true,
  },
  clientLogoutTime: {
    type: Date,
    default: null,
  },
  userLoginTime: {
    type: Date,
    required: true,
  },
  userLogoutTime: {
    type: Date,
    default: null,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalWorkTime: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
