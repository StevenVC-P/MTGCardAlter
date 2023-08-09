// server.js
require("dotenv").config({ path: "../env/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const app = express();

const { determineBackground } = require("../shared/CardBackground.jsx");

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Set limit here
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // If you also send URL-encoded data
app.use("/assets", express.static(path.join(__dirname, "..", "src", "assets")));
app.use(express.static(path.join(__dirname, "../public")));

const engineId = "stable-diffusion-v1-5";
const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;
const PORT = process.env.PORT || 5000;

const cssPaths = [
  path.resolve(__dirname, "..", "src", "components", "Templates", "Universal.css"),
  path.resolve(__dirname, "..", "src", "components", "Templates", "Adventure.css"),
];

async function captureScreenshot(html, type_line, colors, mana_cost) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  await page.setContent(html);
  await page.waitForSelector(".card-background");
  //apple background

  for (const cssPath of cssPaths) {
    const cssContent = fs.readFileSync(cssPath, "utf8");
    await page.addStyleTag({ content: cssContent });
  }

  const backgroundImageURL = determineBackground(type_line, colors, mana_cost);

  await page.evaluate((bgURL) => {
    const cardBackgroundElement = document.querySelector(".card-background");
    if (cardBackgroundElement) {
      cardBackgroundElement.style.backgroundImage = `url(http://localhost:5000${bgURL})`;
      cardBackgroundElement.style.zIndex = 0;
      cardBackgroundElement.style.borderRadius = "6px";
    }
  }, backgroundImageURL);

  await page.setViewport({ width: 250, height: 350 });
  const screenshot = await page.screenshot({
    clip: { x: 8, y: 8, width: 250, height: 350 },
    encoding: "base64",
  });
  await browser.close();
  return screenshot;
}

app.post("/api/convert-to-image", async (req, res) => {
  try {
    const { htmlContent, type_line, colors, mana_cost } = req.body;

    const screenshotBase64 = await captureScreenshot(
      htmlContent,
      type_line,
      colors,
      mana_cost
    );

    res.json({ image: screenshotBase64 });
  } catch (error) {
    console.error("Error converting to image:", error);
    res.status(500).json({ message: "Error converting to image" });
  }
});


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
    // Return the generated image URL or data
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
