const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

require("dotenv").config({ path: "./env/.env" });
const http = require("http");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const express = require("express");
const authenticateToken = require("./utils/authenticateToken");
const setupMiddleware = require("./middleware");
const { credentials } = require("./config/setup");
require("./utils/scryfallUpdater");
const jwtMiddleware = require("./jwtMiddleware");
const sharp = require("sharp");

const { GeneratedImage, UserCard, UserCardImages } = require("./models");

// Adjusted paths
const cardRoutes = require("./routes/cards");
const authRoutes = require("./routes/auth-routes");
const patreonRoutes = require("./routes/patreon-routes");
const userRoutes = require("./routes/user-routes");
const generatedImagesRouter = require("./routes/generatedImages");
const { uploadImageToGCS } = require("./routes/googleRoutes");

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
const PORT = process.env.SERVERPORT || 5000;
const origin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl, {
      headers: {
        Origin: origin,
      },
    });

    if (response.ok) {
      let imageBuffer = await response.buffer();
      const contentType = response.headers.get("Content-Type");

      if (contentType.includes("image/jpeg")) {
        // Decrease JPEG quality
        imageBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 10 }) // Adjust quality as needed
          .toBuffer();
      } else if (contentType.includes("image/png")) {
        // Decrease PNG quality by increasing compression level
        imageBuffer = await sharp(imageBuffer)
          .png({ quality: 10 }) // Adjust quality as needed
          .toBuffer();
      }
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31557600");
      res.send(imageBuffer);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/generate-image", authenticateToken, async (req, res) => {
  
  try {
    const { card_id, height, width, cfg_scale, clip_guidance_preset, sampler, samples, steps, stylePreset, text_prompts, facetype, quantity } = req.body;
    const userId = req.user.id;

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

    // Assuming the first artifact contains the image base64 data
    const base64ImageData = data.artifacts[0].base64;

    // Upload the image to Google Cloud Storage and get the public URL
    const imageUrl = await uploadImageToGCS(base64ImageData, userId);

    const generatedImage = await GeneratedImage.create({
      image_url: imageUrl,
      cfg_scale,
      clip_guidance_preset,
      sampler,
      samples,
      steps,
      style_preset: stylePreset,
    });

    const imageId = generatedImage.image_id;
    const cardImagePairs = [];
    for (let i = 0; i < quantity; i++) {
      const userCard = await UserCard.create({
        user_id: userId,
        card_id,
        face_type: facetype,
      });

      await UserCardImages.create({
        user_card_id: userCard.user_card_id,
        image_id: imageId,
      });

      const cardImagePair = {
        card: {
          user_card_id: userCard.user_card_id,
          face_type: userCard.face_type,
        },
        images: [
          {
            id: imageId,
            image_url: generatedImage.image_url,
          },
        ],
      };

      cardImagePairs.push(cardImagePair); 
    }

    return res.json({cardImagePairs});
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
