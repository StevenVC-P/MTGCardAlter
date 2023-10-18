const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const config = require("../../env/config");
const JWT_SECRET = config.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = config.env.REFRESH_TOKEN_SECRET;
    console.log(JWT_SECRET)
    console.log("                ");
    console.log(REFRESH_TOKEN_SECRET);

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const refreshToken = jwt.sign({ id: -1, email: email }, REFRESH_TOKEN_SECRET); // Dummy ID for now

    // Create a new user with the refresh token
    const newUser = await User.create({
      email,
      username,
      password_hash: hashedPassword,
      refresh_token: refreshToken,
    });

    // Replace dummy ID with real one
    const realAccessToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Standard expiration time
    );

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
      accessToken: realAccessToken,
      refreshToken,
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

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });

    const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: "60m" });

    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
});

router.post("/token", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "Refresh token not provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ success: false, message: "Token is invalid or expired." });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error("Error generating new access token:", error);
    res.status(500).json({ success: false, message: "Error generating new access token" });
  }
});


module.exports = router;
