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
router.get("/send-email", authMiddleware, function (req, res) {
  const receiver = "intex.jero@gmail.com";
  const message = "Hello, this is a test email!";
  try {
    sendEmail(receiver, message);
    res.send("Email sent!");
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
