const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser, deleteUserByUsername} = require("../services/userService");
const logger = require("../logger");
const jwt = require("jsonwebtoken");
const path = require("path");

// Route to get all users
router.get("/get-all-users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// Route to get a specific user by ID
router.get("/getuser/:id", authMiddleware, getUserById);

// Route to update user details
router.put("/:id", authMiddleware, updateUser);

// Route to delete a user
router.delete("/:id", authMiddleware, deleteUser);

router.delete('/username/:username', async (req, res) => {
  try {
    logger.info(`inside /username/:username`);
    const result = await deleteUserByUsername(req.params.username);
    res.json({ msg: result });
  } catch (error) {
    logger.info(`something wrong here ${error}`);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

//Route to employees nav
router.get("/register", authMiddleware, (req, res )=>{
  res.sendFile(path.join(__dirname, "../public/pages/public/register.html"));
});

router.get("/get-users", authMiddleware, (req, res )=>{
  res.sendFile(path.join(__dirname, "../public/pages/public/getUsers.html"));
});

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
