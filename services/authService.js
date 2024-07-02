const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");
const userService = require("./userService");
const logger = require("../logger");

class AuthService {
  async register(reqBody, res) {
    const { firstName, lastName, email, role, username, password, userTimezone, clientTimezone } = reqBody;
    try {
      let existingUser = await userService.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }
      try {
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
          firstName,
          lastName,
          email,
          role,
          username,
          password,
          userTimezone,
          clientTimezone,
        };

        const savedUser = await userService.addUser(newUser);

        const token = generateToken(savedUser);

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

// exports.register = async (req, res) => {
//   const {firstName, lastName, email, role, username, password, userTimezone, clientTimezone} = req.body;

//   try {
//     let user = await userService.getUserByUsername({ username });

//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     let userToSave = new User({
//       firstName,
//       lastName,
//       email,
//       role,
//       username,
//       password,
//       userTimezone,
//       clientTimezone
//     });

//     await userService.addUser(userToSave);
//     res.json({ msg: "User registered successfully" });

//     const token = generateToken(user);
//     res.json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

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
