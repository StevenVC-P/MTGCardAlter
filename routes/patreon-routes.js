const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET } = require("../env/config").env;
const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const User = require("../models/User");

const oauthClient = patreonOAuth(PATREON_CLIENT_ID, PATREON_CLIENT_SECRET);
console.log("steve", Object.keys(oauthClient));

// Redirect to Patreon login
router.get("/auth/patreon", (req, res) => {
  const clientID = PATREON_CLIENT_ID;
  const redirectURI = encodeURIComponent("http://localhost:5000/patreon/oauth/redirect");
  const scopes = encodeURIComponent("identity identity.memberships");
  const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  console.log("Received Token:", token); // Debugging line
  const redirectURL = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes}&state=${token}`;

  res.json({ redirectURL });
});

// Handle OAuth redirect
router.get('/oauth/redirect', async (req, res) => {
  const code = req.query.code;
  const token = req.query.state;
  console.log("Received Token:", token); // Debugging line
  try {
    const tokensResponse = await oauthClient.getTokens(code, "http://localhost:5000/patreon/oauth/redirect");
    const patreonAPIClient = patreonAPI(tokensResponse.access_token);

    // Fetch Patreon user data
    const userResponse = await patreonAPIClient("/current_user");
    const patreonID = userResponse.rawJson.data.id;
    console.log("Received Token:", token);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (err) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }

    const userID = decoded.id;
    console.log(userID);
    // Update the user's patreon_id in your users table
    await User.update({ patreon_id: patreonID }, { where: { id: userID } });

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

        // Fetch the user from the database
        const user = await User.findOne({ where: { id: userID } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the Patreon ID exists for this user
        if (user.patreon_id) {
        // The user has a Patreon ID, so the token is valid
            res.json({ valid: true });
        } else {
        // The user does not have a Patreon ID, so the token is invalid
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating Patreon token:', error);
        res.status(500).json({ message: 'Error validating Patreon token' });
    }
});

module.exports = router;
