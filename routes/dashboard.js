const express = require("express");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard page
 *     description: Retrieve the dashboard page for authenticated users.
 *     tags:
 *       - Dashboard
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/dashboard", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/private/dashboard.html"));
});

module.exports = router;
