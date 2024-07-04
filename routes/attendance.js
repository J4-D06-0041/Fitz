const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { logAttendance, getUserAttendance, getTeamAttendance } = require("../services/attendanceService");

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API endpoints for managing attendance
 */

/**
 * @swagger
 * /attendance/log:
 *   post:
 *     summary: Log attendance
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user logging the attendance
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the attendance log
 *     responses:
 *       200:
 *         description: Attendance logged successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */
router.post("/log", authMiddleware, logAttendance);

/**
 * @swagger
 * /attendance/user:
 *   get:
 *     summary: Get user attendance
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User attendance retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/user", authMiddleware, getUserAttendance);

module.exports = router;
