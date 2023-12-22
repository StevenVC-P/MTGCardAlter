// routes/cards.js
const express = require("express");
const Card = require("../models/Card/CardIndex");
const router = express.Router();

const { normalizeCardName } = require("./helpers/helpers");

router.get("/:id", async (req, res) => {
  const card = await Card.getById(req.params.id);
  res.json(card);
});

router.get("/name/:name", async (req, res) => {
  try {
    const cardName = normalizeCardName(req.params.name);
    const card = await Card.getByName(cardName);

    if (!card) {
      return res.status(404).json({ message: `These cards could not be found` });
    }

    res.json(card);
  } catch (error) {
    console.error("Error fetching card data", error);
    if (error.message.startsWith("No card matches")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred while retrieving card data. Please try again later." });
    }
  }
});

router.get("/", async (req, res) => {
  const cards = await Card.getAll();
  res.json(cards);
});

module.exports = router;
