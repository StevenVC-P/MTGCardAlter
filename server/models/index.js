const User = require("./User");
const Patreon = require("./Patreon");
const TokenTransaction = require("./TokenTransaction");
const Card = require("./Card");

// Define relationships
User.belongsTo(Patreon, { foreignKey: "patreon_account_id", as: "patreonAccount" });
Patreon.hasOne(User, { foreignKey: "patreon_account_id", as: "user" });

User.hasMany(TokenTransaction, { foreignKey: "user_id", sourceKey: "id" });
TokenTransaction.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

module.exports = {
  User,
  Patreon,
  TokenTransaction,
  Card, 
};
