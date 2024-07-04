const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser, deleteUserByUsername} = require("../services/userService");
const logger = require("../logger");
const jwt = require("jsonwebtoken");
const path = require("path");

/**
 * @swagger
 * /api/users/get-all-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *       500:
 *         description: Server error.
 */
router.get("/get-all-users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/users/getuser/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user with the specified ID.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get("/getuser/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /api/users/update/{username}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user details
 *     description: Update the details of a user.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: User's username.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: User object containing the updated details.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user.
 *       500:
 *         description: Server error.
 */
router.put("/update/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;
  const userObject = req.body;

  try {
    const updatedUser = await updateUser(username, userObject);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Delete a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", authMiddleware, deleteUser);

/**
 * @swagger
 * /api/users/delete/{username}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by username
 *     description: Delete a user by their username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: User's username.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.delete('/delete/:username', authMiddleware, async (req, res) => {
  try {
    logger.info(`inside /delete/:username`);
    const result = await deleteUserByUsername(req.params.username);
    res.json({ msg: result });
  } catch (error) {
    logger.info(`something wrong here ${error}`);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/users/register:
 *   get:
 *     tags:
 *       - Users
 *     summary: Employees registration page
 *     description: Get the registration page for employees.
 *     responses:
 *       200:
 *         description: Registration page HTML.
 *       401:
 *         description: Unauthorized.
 */
router.get("/register", authMiddleware, (req, res )=>{
  res.sendFile(path.join(__dirname, "../public/pages/public/register.html"));
});

/**
 * @swagger
 * /api/users/get-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users page
 *     description: Get the page to view all users.
 *     responses:
 *       200:
 *         description: Users page HTML.
 *       401:
 *         description: Unauthorized.
 */
router.get("/get-users", authMiddleware, (req, res )=>{
  res.sendFile(path.join(__dirname, "../public/pages/public/getUsers.html"));
});

/**
 * @swagger
 * /api/users/get-user-role:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user role
 *     description: Get the role of the authenticated user.
 *     responses:
 *       200:
 *         description: User role.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
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
