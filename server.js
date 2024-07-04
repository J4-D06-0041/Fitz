const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const authMiddleware = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const { swaggerUi, swaggerDocs } = require("./swaggerConfig");

// Load config
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Use cookie parser middleware
app.use(cookieParser());

// Init Middleware
app.use(express.json({ extended: false }));

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/users", require("./routes/users"));
app.use("/api/payrate", require("./routes/payrate"));
app.use("/api/main", require("./routes/dashboard"));
app.use("/api/timelog", require("./routes/timelog"));
app.use("/api/pay", require("./routes/pay"));
app.use("/api/mail", require("./routes/mail"));

// Serve static files from the public directory
app.use("/pages/private", authMiddleware, express.static(path.join(__dirname, "public/pages/private")));
app.use("/pages/public", express.static(path.join(__dirname, "public/pages/public")));
app.use(express.static(path.join(__dirname, "public")));

// Add this to serve index.html at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/public/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
