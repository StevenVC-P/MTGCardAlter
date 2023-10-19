const User = require("./User");
const Patreon = require("./Patreon");
const Card = require("./Card");

// Define relationships
User.belongsTo(Patreon, { foreignKey: "patreon_account_id", as: "patreonAccount" });
Patreon.hasOne(User, { foreignKey: "patreon_account_id", as: "user" });

module.exports = {
  User,
  Patreon,
  Card,
};
