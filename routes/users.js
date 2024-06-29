const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../services/userService");
const logger = require("../logger");
const jwt = require("jsonwebtoken");
const path = require("path");

// Route to get all users
router.get("/", authMiddleware, getAllUsers);

// Route to get a specific user by ID
router.get("/getuser/:id", authMiddleware, getUserById);

// Route to update user details
router.put("/:id", authMiddleware, updateUser);

// Route to delete a user
router.delete("/:id", authMiddleware, deleteUser);

//Route to employees nav
router.get("/register", authMiddleware, (req, res )=>{
  res.sendFile(path.join(__dirname, "../public/pages/public/register.html"));
}
)
router.get("/get-user-role", authMiddleware, (req, res) => {
  try {
    logger.info("Inside get-user-role");
    const token = req.cookies.token;
    logger.info(`token from get-user-role ${token}`);
    if (!token) {
      return res.status(401).send({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.info(`decoded from get-user-role ${JSON.stringify(decoded)}`);
      return res.status(200).send(decoded);
    } catch (error) {
      logger.error(`error from get-user-role ${error}`);
      return res.status(401).send({ error: "Invalid token" });
    }
  } catch (error) {
    logger.error(`error from get-user-role ${error}`);
    return res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
