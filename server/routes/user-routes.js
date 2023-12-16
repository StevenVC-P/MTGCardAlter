const express = require("express");
const router = express.Router();
const authenticateToken = require("../utils/authenticateToken");
const User = require("../models/User");

router.get("/tokens/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ tokens: user.tokens });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-tokens/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const newTokenCount = req.body.tokens;

  try {
    const updatedUser = await User.updateUserTokens(userId, newTokenCount);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ tokens: updatedUser.tokens });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
