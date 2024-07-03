const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { logAttendance, getUserAttendance, getTeamAttendance } = require("../services/attendanceService");

router.post("/log", authMiddleware, logAttendance);
router.get("/user", authMiddleware, getUserAttendance);

module.exports = router;
