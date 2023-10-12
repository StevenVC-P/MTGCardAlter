const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log("steve" ,req)
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      username,
      password_hash: hashedPassword,
    });
    // Store the user in the database

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    res.status(200).json({ success: true});
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
});

module.exports = router;
