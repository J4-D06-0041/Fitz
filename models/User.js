const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "auditor"],
    default: "user",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  timezone: {
    type: Number,
    required: true,
  },
  auth: {
    token: {
      type: String,
    },
    expiry: {
      type: Date,
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
