const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const { env } = require("../../env/config");

const { JWT_SECRET, REFRESH_TOKEN_SECRET, EMAIL_USER, EMAIL_PASS } = env;
console.log(EMAIL_USER);
console.log(EMAIL_PASS);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or 465 if using SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

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

    // Generate email verification token
    const emailToken = crypto.randomBytes(64).toString("hex");
    // const refreshToken = jwt.sign({ id: -1, email: email }, REFRESH_TOKEN_SECRET); 

    // Create a new user with the refresh token
    await User.create({
      email,
      username,
      password_hash: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: emailToken,
      // refresh_token: refreshToken,
    });

    const verificationLink = `http://localhost:3000/verify-email?token=${emailToken}`;

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Verify your email address",
      text: `Please click the following link to verify your email address: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully. Please check your email to complete registration.",
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

    const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ where: { emailVerificationToken: token } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    // Mark email as verified
    await User.update({ isEmailVerified: true }, { where: { id: user.id } });

    // Generate tokens
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Update refresh token in database
    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Error verifying email" });
  }
});

router.post("/validate-access-token", (req, res) => {
  const accessToken = req.body.accessToken;
  if (!accessToken) {
    return res.status(400).json({ success: false, message: "Access token not provided." });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);

    User.findOne({ where: { id: decoded.id } })
      .then((user) => {
        if (!user) {
          return res.status(403).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({ success: true, user });
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json({ success: false, message: "Error finding user." });
      });
  } catch (error) {
    console.error("Error validating access token:", error);
    res.status(403).json({ success: false, message: "Invalid access token." });
  }
});


router.post("/token", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("Received this refresh token:", req.body);
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

router.post("/resend", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists and is not already verified
    const user = await User.findOne({ where: { email, isEmailVerified: false } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or already verified." });
    }

    const verificationLink = `http://arcane-proxies.com/verify-email?token=${user.emailVerificationToken}`;

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Verify your email address",
      text: `Please click the following link to verify your email address: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to send verification email." });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ success: true, message: "Verification email sent successfully." });
      }
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ success: false, message: "Error resending verification email" });
  }
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ where: { emailVerificationToken: token } });
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null; // Clear the token as it is no longer needed
  await user.save();

  res.status(200).json({ success: true, message: "Email verified successfully" });
});

module.exports = router;
