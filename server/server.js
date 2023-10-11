// server.js
require("dotenv").config({ path: "../env/.env" });
const http = require("http");
const fs = require("fs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const express = require("express");
const cardRoutes = require("../routes/cards");
const cors = require("cors");
const authRoutes = require("../routes/auth-routes");
const app = express();

const privateKey = fs.readFileSync("./new_server.cert", "utf8");
const certificate = fs.readFileSync("./new_server.key", "utf8");
const credentials = { key: privateKey, cert: certificate };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes); // Added this line
app.use("/api/cards", cardRoutes);
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
});

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

const httpServer = http.createServer(credentials, app);
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});
