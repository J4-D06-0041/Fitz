const winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
  // Define the log format
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }), // log the stack trace
    winston.format.splat(),
    winston.format.json()
  ),
  // Define the transports
  transports: [
    // Console transport
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    // File transport for errors
    new winston.transports.File({ filename: "errors.log", level: "error" }),
    // File transport for all logs
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.exceptions.handle(new winston.transports.File({ filename: "exceptions.log" }));

process.on("unhandledRejection", (reason, p) => {
  throw reason; // This will lead to `logger.exceptions.handle`
});

module.exports = logger;
