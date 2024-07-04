const express = require("express");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /view:
 *   get:
 *     summary: Get the pay.html page
 *     description: Retrieve the pay.html page for authenticated users
 *     tags:
 *       - pay
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
  res.sendFile(path.join(__dirname, "../public/pages/private/pay.html"));
});

module.exports = router;
