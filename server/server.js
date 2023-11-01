require("dotenv").config({ path: "./env/.env" }); // Adjusted path
const http = require("http");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const express = require("express");
const authenticateToken = require("./utils/authenticateToken");
const setupMiddleware = require("./middleware"); 
const { credentials } = require("./config/setup");
const jwtMiddleware = require("./jwtMiddleware");

// Adjusted paths
const cardRoutes = require("./routes/cards");
const authRoutes = require("./routes/auth-routes");
const patreonRoutes = require("./routes/patreon-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
setupMiddleware(app);

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/patreon", patreonRoutes);
app.use("/api/user", userRoutes);

// app.use(jwtMiddleware);

const engineId = "stable-diffusion-v1-5";
const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;
const PORT = process.env.PORT || 5000;

app.post("/api/generate-image", authenticateToken, async (req, res) => {
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
