// routes/cards.js
const express = require("express");
const Card = require("../models/Card");
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
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(card);
  } catch (error) {
    console.error("Error fetching card data:", error);
    res.status(500).json({ message: "Error fetching card data" });
  }
});

router.get("/", async (req, res) => {
  const cards = await Card.getAll();
  res.json(cards);
});

module.exports = router;
