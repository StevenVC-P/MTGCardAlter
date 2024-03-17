const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserCardImages extends Model {}

UserCardImages.init(
  {
    // Composite primary key consisting of user_card_id and image_id
    user_card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "UserCards", // This should match the table name for UserCard
        key: "user_card_id",
      },
    },
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "GeneratedImages", // This should match the table name for GeneratedImage
        key: "image_id",
      },
    },
  },
  {
    sequelize,
    modelName: "UserCardImages",
    tableName: "UserCardImages",
    timestamps: false, // Assuming you don't want Sequelize to handle createdAt and updatedAt
  }
);

module.exports = UserCardImages;
