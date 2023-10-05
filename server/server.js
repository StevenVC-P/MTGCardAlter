// server.js
require("dotenv").config({ path: "../env/.env" });
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const request = require("request");

app.use(cors());
app.use((req, res, next) => {
  // Add this middleware
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const engineId = "stable-diffusion-v1-5";
const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;
const PORT = process.env.PORT || 5000;

app.get("/api/cards/:cardName", async (req, res) => {
  try {
    const cardName = req.params.cardName;
    const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
    if (response.status !== 200) {
      return res.status(400).json({ message: "Error fetching card details" });
    }
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching card data" });
  }
});

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
    
    // Check the response
    if (response.status !== 200) {
      throw new Error(`Non-200 response: ${response.statusText}`);
    }

    const { artifacts } = response.data;

    if (artifacts.length === 0) {
      throw new Error("No artifacts found in the image generation response");
    }

    // Return the generated image URL or data
    return res.json({ image: artifacts[0].base64 });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Error generating image" });
  }
});

app.get("/proxy-image", async (req, res) => {
  const url = req.query.url;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Access-Control-Allow-Origin", "*"); // include the CORS header
    res.end(Buffer.from(response.data, "binary"));
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).end("Error fetching image");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
