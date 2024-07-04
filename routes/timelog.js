const express = require("express");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /view:
 *   get:
 *     summary: Get the timelog view page
 *     description: Retrieve the timelog view page for authenticated users
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
router.get("/view", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/private/timelog.html"));
});

module.exports = router;
