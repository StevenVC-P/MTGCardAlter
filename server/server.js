// server.js
require("dotenv").config({ path: "../env/.env" });
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");

// const generateImage = require("./ImgDataFormatter");
// require("path").posix = require("path-browserify");

app.use(cors());
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
  console.log("engineId", engineId);
  console.log("apiHost", apiHost);
  console.log("apiKey", apiKey);
  console.log("reqbody", req.body);
  try {
    const { height, width, cfg_scale, clip_guidance_preset, sampler, samples, steps, style_preset, text_prompts } = req.body;

    // Perform the image generation using Stability.AI API
    const response = await fetch(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        height,
        width,
        cfg_scale,
        clip_guidance_preset,
        sampler,
        samples,
        steps,
        style_preset,
        text_prompts,
      }),
    });
    //   // Return the generated image URL or data
    // res.json({ image: generatedImageURL });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const { artifacts } = await response.json();

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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
