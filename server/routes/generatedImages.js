// routes/generatedImages.js

const express = require("express");
const axios = require("axios");
const router = express.Router();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/database");
const authenticateToken = require("../utils/authenticateToken");
const { Card, GeneratedImage, UserCard } = require("../models/index");
const { uploadImageToGCS, deleteImagesFromGCS } = require("./googleRoutes");

const engineId = "stable-diffusion-v1-6";
const apiHost = process.env.API_HOST;
const apiKey = process.env.STABILITY_API_KEY;
const PORT = process.env.SERVERPORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
// Route to get a list of generated images by a user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    const images = await GeneratedImage.findAll({
      where: { user_id: userId },
    });
    res.json(images);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Route to create a new generated image
router.post("/", async (req, res) => {
  try {
    const newImage = await GeneratedImage.create(req.body);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // The user ID obtained from the verified token

    const userCardInstances = await UserCard.findAll({
      where: { user_id: userId, rec_stat: true },
      attributes: ["user_card_id", "face_type"],
      include: [
        {
          model: Card,
          as: "card",
          required: true,
        },
        {
          model: GeneratedImage,
          as: "generatedImages", // Use the same alias as in your association
          required: false,
          attributes: ["image_id", "image_url", "cfg_scale", "clip_guidance_preset", "sampler", "steps", "style_preset"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Format the response to include card data along with all associated images
    const responseData = await Promise.all(
      userCardInstances.map(async (userCard) => {

        const additionalCardData = await Card.getAdditionalData(userCard.card);

        const cardDetails = {
          // Standard card properties from dataValues
          card_id: additionalCardData.dataValues.card_id,
          oracle_id: additionalCardData.dataValues.oracle_id,
          mtgo_id: additionalCardData.dataValues.mtgo_id,
          tcgplayer_id: additionalCardData.dataValues.tcgplayer_id,
          cardmarket_id: additionalCardData.dataValues.cardmarket_id,
          name: additionalCardData.dataValues.name,
          mana_cost: additionalCardData.dataValues.mana_cost,
          type_line: additionalCardData.dataValues.type_line,
          oracle_text: additionalCardData.dataValues.oracle_text,
          flavor_text: additionalCardData.dataValues.flavor_text,
          power: additionalCardData.dataValues.power,
          toughness: additionalCardData.dataValues.toughness,
          watermark: additionalCardData.dataValues.watermark,
          artist: additionalCardData.dataValues.artist,
          lang: additionalCardData.dataValues.lang,
          loyalty: additionalCardData.dataValues.loyalty,
          released_at: additionalCardData.dataValues.released_at,
          uri: additionalCardData.dataValues.uri,
          scryfall_uri: additionalCardData.dataValues.scryfall_uri,
          layout: additionalCardData.dataValues.layout,
          cmc: additionalCardData.dataValues.cmc,
          rarity: additionalCardData.dataValues.rarity,
          border_color: additionalCardData.dataValues.border_color,
          set_id: additionalCardData.dataValues.set_id,
          set_code: additionalCardData.dataValues.set_code,
          set_name: additionalCardData.dataValues.set_name,
          set_type: additionalCardData.dataValues.set_type,
          oversized: additionalCardData.dataValues.oversized,
          promo: additionalCardData.dataValues.promo,
          reprint: additionalCardData.dataValues.reprint,
          variation: additionalCardData.dataValues.variation,
          digital: additionalCardData.dataValues.digital,
          booster: additionalCardData.dataValues.booster,
          story_spotlight: additionalCardData.dataValues.story_spotlight,
          edhrec_rank: additionalCardData.dataValues.edhrec_rank,
          penny_rank: additionalCardData.dataValues.penny_rank,

          // Additional properties from getAdditionalData
          colors: additionalCardData.colors,
          keywords: additionalCardData.keywords,
          color_identity: additionalCardData.color_identity,
          card_faces: additionalCardData.card_faces,
          relatedCards: additionalCardData.relatedCards,
          legalities: additionalCardData.legalities,
          games: additionalCardData.games,
        };


        return {
          card: {
            user_card_id: userCard.user_card_id,
            face_type: userCard.face_type,
          },
          card_details: cardDetails,
          images: Array.isArray(userCard.generatedImages)
            ? userCard.generatedImages.map((image) => ({
                image_id: image.image_id,
                image_url: `${BASE_URL}/proxy-image?url=${encodeURIComponent(image.image_url)}`,
              }))
            : [],
        };
      })
    );

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching user cards and images:", error);
    res.status(500).send(error.message);
  }
});

router.post("/generate-multi-face-image", authenticateToken, async (req, res) => {
  try {
    const { card_id, faces } = req.body;
    const userId = req.user.id;

    // Find or create a UserCard instance
    const userCard = await UserCard.create({
      user_id: userId,
      card_id: card_id,
    });

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 300000, // Timeout after 300 seconds (5 minutes)
    };

    const imageObjects = []; 
    // Process each face and generate images
    for (const face of faces) {
      // External API call to generate image (replace with your actual API call logic)
      const imageResponse = await axios.post(
        `${apiHost}/v1/generation/${engineId}/text-to-image`,
        {
          // Include necessary parameters for image generation
          height: face.height,
          width: face.width,
          cfg_scale: face.cfg_scale,
          clip_guidance_preset: face.clip_guidance_preset,
          sampler: face.sampler,
          samples: face.samples,
          steps: face.steps,
          style_preset: face.stylePreset,
          text_prompts: face.text_prompts,
        },
        axiosConfig
      );

      const data = imageResponse.data;

      if (!data.artifacts || data.artifacts.length === 0) {
        throw new Error("No artifacts found in the image generation response");
      }

      const base64ImageData = data.artifacts[0].base64;

      // Upload the image to Google Cloud Storage and get the public URL
      const imageUrl = await uploadImageToGCS(base64ImageData, userId);

      // Handle the response and save the generated image
      if (imageResponse.status === 200 && imageResponse.data.artifacts) {
        const generatedImage = await GeneratedImage.create({
          user_card_id: userCard.user_card_id,
          image_url: imageUrl,
          cfg_scale: face.cfg_scale,
          clip_guidance_preset: face.clip_guidance_preset,
          sampler: face.sampler,
          samples: face.samples,
          steps: face.steps,
          style_preset: face.stylePreset,
        });

        imageObjects.push({
          image_id: generatedImage.image_id, // Sequelize returns the auto-incremented ID
          image_url: generatedImage.image_url,
        });

      } else {
        throw new Error("Failed to generate image");
      }
    }

    res.json({
      card: {
        user_card_id: userCard.user_card_id,
        face_type: userCard.face_type,
      },
      images: imageObjects,
    });
  } catch (error) {
    console.error("Error generating images for multi-face card:", error);

    // Detailed error handling similar to /api/generate-image route
    let errorMessage = "Error generating images";
    let errorDetails = {};

    if (error.response?.data?.message === "Invalid prompts detected") {
      return res.status(400).json({
        message: "Invalid prompt detected.",
        error: true,
      });
    }

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      errorMessage = "The request to the image generation API timed out.";
      errorDetails = {
        checkStatus: "https://imagegenerationapi.com/api/status/", // Adjust URL as needed
      };
    }

    res.status(500).json({
      message: errorMessage,
      ...errorDetails,
      error: true,
    });
  }
});

router.get("/:imageId", async (req, res) => {
  try {
    const image = await GeneratedImage.findOne({
      where: {
        image_id: req.params.imageId,
      },
    });
    if (!image) {
      return res.status(404).send("Image not found");
    }
    res.json(image);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to delete a generated image by its ID
router.delete("/:userCardId", authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const userCardId = req.params.userCardId;
    // Find the UserCard to ensure it belongs to the user
    const userCard = await UserCard.findOne({
      where: { 
        user_card_id: userCardId,
        user_id: userId
      },
      transaction: transaction
    });

    if (!userCard) {
      await transaction.rollback();
      return res.status(404).send("User card not found or you do not have permission to delete this card.");
    }

    await userCard.update({ rec_stat: false }, { transaction: transaction });

    await transaction.commit();
    res.send("User card and associated images deleted successfully.");
  } catch (error) {
    console.error("Error fetching generated images:", error);
    await transaction.rollback();
    res.status(500).send(error.message);
  }
});

router.patch("/soft-delete-all-cards", authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {

    const userId = req.user.id;
    console.log(userId);
    // Update the rec_stat for all UserCard records to false
    const updateResult = await UserCard.update(
      { rec_stat: false },
      {
        where: {
          user_id: userId,
          rec_stat: true, // Only update cards that are not already soft-deleted
        },
        transaction: transaction,
      }
    );

    // Check the result of the update to see if any rows were affected
    if (updateResult[0] > 0) {
      await transaction.commit();
      return res.status(200).json({ success: true, message: "All cards soft deleted successfully." });
    } else {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "No cards found to soft delete." });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error soft deleting all cards:", error);
    return res.status(500).json({ success: false, message: "Error soft deleting all cards." });
  }
});

module.exports = router;
