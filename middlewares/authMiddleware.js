const jwt = require("jsonwebtoken");
const path = require("path");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Accessing the token stored in cookies

  if (!token) {
    res.sendFile(path.join(__dirname, "../public/pages/public/unauthorized.html"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendFile(path.join(__dirname, "../public/pages/public/unauthorized.html"));
  }
};

module.exports = authMiddleware;
