const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const FB = require("fb");
// const PatreonStrategy = require("patreon").OAuth;
const { getUserById, createUser } = require('../db');
 const { validatePatreonToken } = require("./helpers/helpers");
const User = require('../models/User');


// router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), function (req, res) {
  // res.json({ token: req.user }); // req.user will contain the JWT
// });

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), function (req, res) {
  res.json({ token: req.user }); // req.user will contain the JWT
});

router.post("/auth/facebook/token", async (req, res) => {
  try {
    const { token } = req.body;
    // Verify Facebook token and do your logic here
    res.json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/auth/facebook/token", async (req, res) => {
  try {
    const { token } = req.body;

    FB.api("me", { fields: ["id", "name", "email"], access_token: token }, async function (response) {
        if (!response || response.error) {
            console.log(!response ? "error occurred" : response.error);
            return res.status(500).json({ status: "error", message: "Failed to authenticate" });
        }

        const facebookId = response.id;
        const email = response.email;
        const name = response.name;

        let user = await getUserById(facebookId, "facebook");

        if (!user) {
        user = await createUser({ id: facebookId, email, name }, "facebook");
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ id: facebookId, email, name }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ user, token: jwtToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

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
    await User.create({
      email,
      username,
      password_hash: hashedPassword,
    });
    // Store the user in the database

    res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // If no user is found, return an error
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // Compare the inputted password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // If user is authenticated, generate a JWT token
    // const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // res.status(200).json({ success: true, token: jwtToken });
    res.status(200).json({ success: true});
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
});

module.exports = router;
