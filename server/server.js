// server.js
require("dotenv").config({ path: "../env/.env" });
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const PatreonStrategy = require("passport-patreon").Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const cardRoutes = require("../routes/cards");
const cors = require("cors");
const authRoutes = require("../routes/auth-routes"); // Make sure the path is correct
const jwtMiddleware = require("./jwtMiddleware"); // Make sure the path is correct
const app = express();

const privateKey = fs.readFileSync("../server.key", "utf8");
const certificate = fs.readFileSync("../server.cert", "utf8");

const credentials = { key: privateKey, cert: certificate };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRoutes); // Added this line
app.use("/api/cards", cardRoutes);

const engineId = "stable-diffusion-v1-5";
const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;
const PORT = process.env.PORT || 5000;

app.post("/api/generate-image", async (req, res) => {
  try {
    const { height, width, cfg_scale, clip_guidance_preset, sampler, samples, steps, style_preset, text_prompts } = req.body;

    // Perform the image generation using Stability.AI API
    const response = await axios.post(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        height,
        width,
        cfg_scale,
        clip_guidance_preset,
        sampler,
        samples,
        steps,
        style_preset,
        text_prompts,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Access data
    const data = response.data;

    // Check for artifacts
    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error("No artifacts found in the image generation response");
    }

    // Return the generated image URL or data
    return res.json({ image: data.artifacts[0].base64 });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Error generating image" });
  }
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // Lookup or create a user in your MySQL database
//       const jwtToken = jwt.sign({ id: profile.id, name: profile.displayName }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       done(null, jwtToken);
//     }
//   )
// );
      console.log(process.env.FACEBOOK_CLIENT_ID);
passport.use(

  new FacebookStrategy(

    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Lookup or create a user in your MySQL database
      const jwtToken = jwt.sign({ id: profile.id, name: profile.displayName }, process.env.JWT_SECRET, { expiresIn: "1h" });
      done(null, jwtToken);
    }
  )
);

// passport.use(
//   new PatreonStrategy(
//     {
//       clientID: process.env.PATREON_CLIENT_ID,
//       clientSecret: process.env.PATREON_CLIENT_SECRET,
//       callbackURL: "/auth/patreon/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // Logic here to lookup/create a user in your MySQL database
//       // Assuming you will generate JWT token here as well.
//       const jwtToken = jwt.sign({ id: profile.id, name: profile.displayName }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       done(null, jwtToken);
//     }
//   )
// );

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
