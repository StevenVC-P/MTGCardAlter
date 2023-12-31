require("dotenv").config({ path: "./env/.env" });
const http = require("http");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const express = require("express");
const authenticateToken = require("./utils/authenticateToken");
const setupMiddleware = require("./middleware"); 
const { credentials } = require("./config/setup");
const jwtMiddleware = require("./jwtMiddleware");

const { GeneratedImage, UserCard } = require("./models");

// Adjusted paths
const cardRoutes = require("./routes/cards");
const authRoutes = require("./routes/auth-routes");
const patreonRoutes = require("./routes/patreon-routes");
const userRoutes = require("./routes/user-routes");
const generatedImagesRouter = require("./routes/generatedImages"); 

const app = express();
setupMiddleware(app);

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/patreon", patreonRoutes);
app.use("/api/user", userRoutes);
app.use("/api/generated-images", generatedImagesRouter);

// app.use(jwtMiddleware);

const engineId = "stable-diffusion-v1-6";
const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;
const PORT = 5000;

app.post("/api/generate-image", authenticateToken, async (req, res) => {
  try {
      const { card_id, height, width, cfg_scale, clip_guidance_preset, sampler, samples, steps, stylePreset, text_prompts, facetype } = req.body;
    // Perform the image generation using Stability.AI API
    const userId = req.user.id;
    const userCard = await UserCard.create({
      user_id: userId,
      card_id,
      face_type: facetype
    });
    // Add a timeout configuration to the axios request
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 300000, // Timeout after 300 seconds (5 minutes)
    };
    
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
        style_preset: stylePreset,
        text_prompts,
      },
      axiosConfig
    );

    // Access data
    const data = response.data;

  // Check for artifacts
    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error("No artifacts found in the image generation response");
    }
    
    const generatedImage = await GeneratedImage.create({
      user_card_id: userCard.user_card_id,
      image_url: data.artifacts[0].base64,
      cfg_scale,
      clip_guidance_preset,
      sampler,
      samples,
      steps,
      style_preset: stylePreset,
    });

    const imageObject = {
      image_id: generatedImage.user_card_id,
      image_url: generatedImage.image_url,
    };

    return res.json({
      card: {
        user_card_id: userCard.user_card_id,
        face_type: userCard.face_type, 
      },
      images: [imageObject],
    });
  } catch (error) {
    console.error("Error generating image:", error);

    let errorMessage = "Error generating image";
    let errorDetails = {};

    if (error.response?.data?.message === "Invalid prompts detected") {
      return res.status(400).json({
        message: "Invalid prompt detected. 🚨",
        error: true,
      });
    }

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      errorMessage = "The request to DreamStudio API timed out. They might be experiencing issues";
      errorDetails = {
        checkStatus: "https://dreamstudio.com/api/status/",
      };
    }

    res.status(500).json({
      message: errorMessage,
      ...errorDetails,
      error: true,
    });
  }
});

const httpServer = http.createServer(credentials, app);
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});
