const User = require("../models/User");

class UserController {
  constructor() {}

  async getAllUsers() {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async updateUser(userObject) {
    const { username, role } = req.body;
    const userFields = { irstName, lastName, email, role, timezone, username, password };

    try {
      await User.find({});
      let user = await User.findById(userObject.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user = await User.findByIdAndUpdate(userObject.id, { $set: userFields }, { new: true });

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async deleteUser(userId) {
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      await User.findByIdAndRemove(userId);

      res.json({ msg: "User removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async deleteUserByUsername(username) {
    try {
      let user = await User.find({ username: username });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      await User.findByIdAndRemove({ username: username });

      res.json({ msg: "User removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async addUser(userObject) {
    try {
      // Check if the user already exists
      let user = await User.findOne({ username: userObject.username });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Create a new user
      user = new User({
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: userObject.email,
        role: userObject.role,
        timezone: userObject.timezone,
        username: userObject.username,
        password: userObject.password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // Save the user to the database
      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
}

module.exports = new UserController();
