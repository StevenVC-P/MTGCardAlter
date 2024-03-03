const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserPatreonLink extends Model {}

UserPatreonLink.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Ensure one-to-one relation
      references: {
        model: "users",
        key: "id",
      },
    },
    patreon_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Ensure one-to-one relation
      references: {
        model: "patreon_accounts",
        key: "id",
      },
    },
    linked_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "UserPatreonLink",
    tableName: "user_patreon_link",
    timestamps: false,
  }
);

module.exports = UserPatreonLink;
