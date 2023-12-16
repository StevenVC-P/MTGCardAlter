const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

module.exports = {
  env: {
    API_HOST: process.env.API_HOST,
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    PATREON_CLIENT_ID: process.env.PATREON_CLIENT_ID,
    PATREON_CLIENT_SECRET: process.env.PATREON_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS
  },
};
