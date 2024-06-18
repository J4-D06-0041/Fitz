const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");

// Load config
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/users", require("./routes/users"));
app.use("/api/payrate", require("./routes/payrate"));
app.use("/api/main", require("./routes/dashboard"));
app.use("/api/timelog", require("./routes/timelog"));
app.use("/api/pay", require("./routes/pay"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
