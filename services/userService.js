const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../logger");

class UserController {
  constructor() {}

  async getAllUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.find().select("-password");
        resolve(users);
      } catch (error) {
        console.error(err.message);
        reject("Server error", error);
      }
    });
  }

  async getUserById(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          resolve(null);
        }
        resolve(user);
      } catch (err) {
        console.error(err.message);
        reject(err.message);
      }
    });
  }

  async getUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ username: username }).lean();
        resolve(user);
      } catch (error) {
        console.error(err.message);
        reject(error);
      }
    });
  }

  async updateUser(userObject) {
    return new Promise(async (resolve, reject) => {
      const { username, role } = req.body;
      const userFields = { firstName, lastName, email, role, timezone, username, password };

      try {
        await User.find({});
        let user = await User.findById(userObject.id);
        if (!user) {
          reject("user not found");
        }

        user = await User.findByIdAndUpdate(userObject.id, { $set: userFields }, { new: true });

        resolve(user);
      } catch (error) {
        console.error(err.message);
        reject("Server error", error);
      }
    });
  }

  async deleteUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findById(userId);
        if (!user) {
          reject("user not found");
        }

        await User.findByIdAndRemove(userId);

        resolve("User removed");
      } catch (error) {
        console.error(err.message);
        reject("Server error", error);
      }
    });
  }

  async deleteUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.find({ username: username });
        if (!user) {
          reject("User not found");
        }

        await User.findByIdAndRemove({ username: username });

        resolve("User removed");
      } catch (error) {
        console.error(err.message);
        reject("Server error", error);
      }
    });
  }

  async addUser(userObject) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the user already exists
        let user = await User.findOne({ username: userObject.username });
        if (user) {
          return reject({ msg: "User already exists" });
        }

        // Create a new user
        user = new User({
          firstName: userObject.firstName,
          lastName: userObject.lastName,
          email: userObject.email,
          role: userObject.role,
          username: userObject.username,
          password: userObject.password,
          userTimezone: userObject.userTimezone,
          clientTimezone: userObject.clientTimezone,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(userObject.password, salt);

        // Save the user to the database
        await user.save();
        logger.info(`User registered successfully ${user}`);
        resolve(user);
      } catch (error) {
        logger.error(error);
        reject("Server error", error);
      }
    });
  }

  updateUserToken(userId, token, expiry) {
    return new Promise(async (resolve, reject) => {
      try {
        await User.findByIdAndUpdate(userId, { token, expiry }, { new: true });
        resolve();
      } catch (error) {}
    });
  }
}

module.exports = new UserController();
