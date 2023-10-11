const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const PatreonStrategy = require("passport-patreon").Strategy;

// passport.use(
//   new GoogleStrategy({
//     // ... Configuration
//   })
// );

// Similar setup for Facebook and Patreon

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    // ...other options
  })
);
