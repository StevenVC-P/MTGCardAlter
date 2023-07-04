require("dotenv").config();

module.exports = {
 env: {
    API_HOST: process.env.API_HOST,
    STABILITY_API_KEY: process.env.STABILITY_API_KEY
 },
}