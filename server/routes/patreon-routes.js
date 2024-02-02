const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET } = require("../../env/config").env;
const { updateDatabaseWithPatreonInfo } = require("../helpers/patreonHelper");
const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const { User, Patreon, UserPatreonLink } = require("../models");

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
    } catch (err) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }

    const userID = decoded.id;

    let [patreonAccount] = await Patreon.findOrCreate({
      where: { patreon_id: patreonID },
    });

    // Find the user by ID
    const user = await User.findOne({ where: { id: userID } });
    if (user) {
      await UserPatreonLink.findOrCreate({
        where: { user_id: user.id, patreon_account_id: patreonAccount.id },
      });

      if (patreonAccount.deferred_tokens > 0) {
        user.tokens += patreonAccount.deferred_tokens;
        await user.save();

        patreonAccount.deferred_tokens = 0;
        await patreonAccount.save();
      }
    }

    // Redirect back to frontend with a query parameter
    res.redirect(`http://localhost:3000/?patreonConnected=true&token=${token}`);
  } catch (error) {
    console.log("Error details:", error);
    if (error.name === "JsonWebTokenError") {
      console.log("JWT Error details:", error.message);
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

    const userPatreonLink = await UserPatreonLink.findOne({
      where: { user_id: userID },
      include: {
        model: Patreon,
        as: "patreonAccount",
      },
    });

    if (!userPatreonLink) {
      return res.json({ valid: false });
    }

    const accessToken = jwt.sign({ id: userID, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userID, email: decoded.email }, process.env.REFRESH_TOKEN_SECRET);

    await User.update({ refresh_token: refreshToken }, { where: { id: userID } });
    res.status(200).json({ valid: true, accessToken, refreshToken });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid JWT token" });
    }
    console.error("Error validating Patreon token:", error);
    res.status(500).json({ message: "Error validating Patreon token" });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    console.log(req.body)


    const userObject = req.body.included.find((obj) => obj.type === "user");
    if (!userObject) {
      console.log("User object not found in the included array");
      return res.status(404).send("User object not found");
    }

    const patreonId = userObject.id;
    const pledgeAmountCents = req.body.data.attributes.pledge_amount_cents;
    console.log("pledgeAmountCents ",pledgeAmountCents);
    // Find the Patreon record by patreonId
    let patreonRecord = await Patreon.findOne({ where: { patreon_id: patreonId } });

    if (!patreonRecord) {
      console.log(`Patreon record with Patreon ID ${patreonId} not found`);
      patreonRecord = await Patreon.create({
        patreon_id: patreonId,
        total_pledged: pledgeAmountCents,
      });
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