const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserCard extends Model {}

UserCard.init(
  {
    user_card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    card_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "Card",
        key: "card_id",
      },
    },
    face_type: {
      type: DataTypes.ENUM("front", "back"),
      allowNull: true, 
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "UserCard",
    tableName: "UserCards",
    timestamps: false,
  }
);

module.exports = UserCard;
