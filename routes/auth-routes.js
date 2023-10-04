const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const FB = require("fb");
// const PatreonStrategy = require("patreon").OAuth;
const { getUserById, createUser } = require('../db');
 const { validatePatreonToken } = require("./helpers/helpers");


// router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), function (req, res) {
//   res.json({ token: req.user }); // req.user will contain the JWT
// });

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), function (req, res) {
  res.json({ token: req.user }); // req.user will contain the JWT
});

// router.post("/auth/google/token", async (req, res) => {
//   try {
//     const { token } = req.body;
//     // Verify Google token and do your logic here
//     res.json({ status: "success", token });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

router.post("/auth/facebook/token", async (req, res) => {
  try {
    const { token } = req.body;
    // Verify Facebook token and do your logic here
    res.json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// router.post("/google/token", async (req, res) => {
//     try {
//         const googleToken = req.body.token;
//         const ticket = await client.verifyIdToken({
//         idToken: googleToken,
//         audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();
//         const googleId = payload["sub"];
//         const email = payload["email"];
//         const name = payload["name"];
//         const picture = payload["picture"];

//     let user = await getUserById(googleId, "google");

//     if (!user) {
//     user = await createUser({ id: googleId, email, name, picture }, "google");
//     }
//         // Generate JWT token
//         const jwtToken = jwt.sign({ id: googleId, email, name }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//         });

//         res.json({ user, token: jwtToken });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error processing Google token" });
//     }
// });

router.post("/auth/facebook/token", async (req, res) => {
  try {
    const { token } = req.body;

    FB.api("me", { fields: ["id", "name", "email"], access_token: token }, async function (response) {
        if (!response || response.error) {
            console.log(!response ? "error occurred" : response.error);
            return res.status(500).json({ status: "error", message: "Failed to authenticate" });
        }

        const facebookId = response.id;
        const email = response.email;
        const name = response.name;

        let user = await getUserById(facebookId, "facebook");

        if (!user) {
        user = await createUser({ id: facebookId, email, name }, "facebook");
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ id: facebookId, email, name }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ user, token: jwtToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// router.post("/auth/patreon/token", async (req, res) => {
//   try {
//     const { token } = req.body;

//     // Assuming that you have a function to validate the Patreon token and get user data.
//     // This is just placeholder logic; you would actually call Patreon's API to validate the token and get user data.
//     const response = await validatePatreonToken(token);

//     const patreonId = response.id;
//     const email = response.email;
//     const name = response.name;

//     let user = await getUserById(patreonId, "patreon");

//     if (!user) {
//       user = await createUser({ id: patreonId, email, name }, "patreon");
//     }

//     const jwtToken = jwt.sign({ id: patreonId, email, name }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ user, token: jwtToken });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

module.exports = router;
