const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/tokens/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {

    const user = await User.getUserById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ tokens: user.tokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
