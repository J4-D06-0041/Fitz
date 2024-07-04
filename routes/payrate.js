const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { addPayrate, getPayrateByUserId, updatePayrate } = require("../services/payrateService");

/**
 * @swagger
 * tags:
 *   name: Payrate
 *   description: API endpoints for managing pay rates
 */

/**
 * @swagger
 * /payrate:
 *   post:
 *     summary: Add a new pay rate
 *     tags: [Payrate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payrate'
 *     responses:
 *       200:
 *         description: Successfully added the pay rate
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, addPayrate);

/**
 * @swagger
 * /payrate/{userId}:
 *   get:
 *     summary: Get pay rate by user ID
 *     tags: [Payrate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the pay rate
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pay rate not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", authMiddleware, getPayrateByUserId);

/**
 * @swagger
 * /payrate/{userId}:
 *   put:
 *     summary: Update pay rate for a user
 *     tags: [Payrate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payrate'
 *     responses:
 *       200:
 *         description: Successfully updated the pay rate
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pay rate not found
 *       500:
 *         description: Internal server error
 */
router.put("/:userId", authMiddleware, updatePayrate);

module.exports = router;
