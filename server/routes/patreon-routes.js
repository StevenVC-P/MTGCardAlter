const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET } = require("../../env/config").env;
const { updateDatabaseWithPatreonInfo } = require("../helpers/patreonHelper");
const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const { User, Patreon } = require("../models");

const oauthClient = patreonOAuth(PATREON_CLIENT_ID, PATREON_CLIENT_SECRET);

// Redirect to Patreon login
router.get("/auth/patreon", (req, res) => {
  const clientID = PATREON_CLIENT_ID;
  const redirectURI = encodeURIComponent("http://localhost:5000/patreon/oauth/redirect");
  const scopes = encodeURIComponent("identity identity.memberships");
  const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  const redirectURL = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes}&state=${token}`;

  res.json({ redirectURL });
});

// Handle OAuth redirect
router.get("/oauth/redirect", async (req, res) => {
  const code = req.query.code;
  const token = req.query.state;
  try {
    const tokensResponse = await oauthClient.getTokens(code, "http://localhost:5000/patreon/oauth/redirect");
    const patreonAPIClient = patreonAPI(tokensResponse.access_token);

    // Fetch Patreon user data
    const userResponse = await patreonAPIClient("/current_user");
    const patreonID = userResponse.rawJson.data.id;
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (err) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }

    const userID = decoded.id;

    // Check if Patreon entry exists for this user
    const existingPatreon = await Patreon.findOne({ where: { userId: userID } });

    if (existingPatreon) {
      // If Patreon entry exists, update it
      await Patreon.update({ patreon_id: patreonID }, { where: { userId: userID } });
    } else {
      // Otherwise, create a new Patreon entry and associate it with the user
      await Patreon.create({ patreon_id: patreonID, userId: userID });
    }

    // Redirect back to frontend with a query parameter
    res.redirect(`http://localhost:3000/?patreonConnected=true&token=${token}`);
  } catch (error) {
    console.log("Error details:", error);
    if (error.name === "JsonWebTokenError") {
      console.log("JWT Error details:", error.message); // Debugging line
    }
    res.status(500).json({ message: "Error processing Patreon token" });
  }
});

router.post("/validate-patreon-token", async (req, res) => {
  const { token } = req.body;
  try {
    // Decode the JWT to get the user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }

    const userID = decoded.id;
    // Fetch the user from the database along with its related Patreon account
    const user = await User.findOne({
      where: { id: userID },
      include: {
        model: Patreon,
        as: "patreonAccount",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Now, check if the user has a related Patreon account
    if (user.patreonAccount && user.patreonAccount.patreon_id) {
      const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET);

      await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });
      res.status(200).json({ valid: true, accessToken, refreshToken });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error("Error validating Patreon token:", error);
    res.status(500).json({ message: "Error validating Patreon token" });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    // Extract necessary data from the webhook payload
    const patreonId = req.body.data.relationships.patron.data.id;
    const pledgeAmountCents = req.body.data.attributes.amount_cents;

    // Find the Patreon record by patreonId
    const patreonRecord = await Patreon.findOne({ where: { patreon_id: patreonId } });

    if (!patreonRecord) {
      console.log(`Patreon record with Patreon ID ${patreonId} not found`);
      return res.status(404).send("Patreon record not found");
    }

    // Update the total pledged amount based on the pledgeAmount
    await updateDatabaseWithPatreonInfo(patreonRecord.id, pledgeAmountCents);

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing Patreon webhook:", error);
    res.status(500).json({ message: "Error processing Patreon webhook" });
  }
});

module.exports = router;