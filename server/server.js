// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());

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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
