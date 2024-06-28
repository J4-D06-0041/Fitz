const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");
const userService = require("./userService");

class AuthService {
  async register(firstName, lastName, email, role, username, password, userTimezone, clientTimezone) {
    const { firstName, lastName, email, role, timezone, username, password } = req.body;

    try {
      let user = await userController.getUserByUsername(username);

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      try {
        let userToSave = new User({ firstName, lastName, email, role, timezone, username, password });
        let savedUser = await userController.addUser(userToSave);
        res.json({ msg: "User registered successfully" });
      } catch (error) {
        res.status(500).send(`Server error ${error}`);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send(`Server error ${err}`);
    }
  }
}

module.exports = new AuthService();

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      password,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
