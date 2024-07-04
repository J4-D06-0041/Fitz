const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const nodemailer = require("nodemailer");
const logger = require("../logger");

// Define the email sending function
function sendEmail(receiver, message) {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tsiincmailer@gmail.com",
      pass: "mailerpassword",
    },
  });

  // Define the email options
  const mailOptions = {
    from: "tsiincmailer@gmail.com",
    to: receiver,
    subject: "Email Subject",
    text: message,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      logger.error(error);
    } else {
      logger.error("Email sent: " + info.response);
    }
  });
}

// Example route that sends an email
/**
 * @swagger
 * /send-email:
 *   get:
 *     summary: Send an email
 *     description: Sends an email to the specified receiver.
 *     tags:
 *       - Email
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Email sent!
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/send-email", authMiddleware, function (req, res) {
  const receiver = "intex.jero@gmail.com";
  const message = "Hello, this is a test email!";
  try {
    sendEmail(receiver, message);
    res.status(200).json({ message: "Email sent!" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
