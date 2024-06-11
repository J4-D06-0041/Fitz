const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// Load config
dotenv.config({ path: "./config/config.env" });

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
