const User = require("./User");
const Patreon = require("./Patreon");
const TokenTransaction = require("./TokenTransaction");
const CardModel = require("./Card/CardModel");
const cardMixin = require("./Card/cardMixin");
const GeneratedImage = require("./GeneratedImages");
const UserCard = require("./UserCard");

// Apply the mixin to add custom methods to CardModel
const Card = cardMixin(CardModel);

// Define relationships
User.belongsTo(Patreon, { foreignKey: "patreon_account_id", as: "patreonAccount" });
Patreon.hasOne(User, { foreignKey: "patreon_account_id", as: "user" });

User.hasMany(TokenTransaction, { foreignKey: "user_id", sourceKey: "id" });
TokenTransaction.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

// New associations for UserCard and GeneratedImage
User.hasMany(UserCard, { foreignKey: "user_id", sourceKey: "id", as: "userCards" });
UserCard.belongsTo(User, { foreignKey: "user_id", targetKey: "id", as: "user" });

Card.hasMany(UserCard, { foreignKey: "card_id", sourceKey: "card_id", as: "userCards" });
UserCard.belongsTo(Card, { foreignKey: "card_id", targetKey: "card_id", as: "card" });

UserCard.hasMany(GeneratedImage, { foreignKey: "user_card_id", as: "generatedImages" });
GeneratedImage.belongsTo(UserCard, { foreignKey: "user_card_id", as: "userCard" });

module.exports = {
  User,
  Patreon,
  TokenTransaction,
  Card,
  GeneratedImage,
  UserCard,
};
