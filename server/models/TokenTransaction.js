const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../config/database");

class TokenTransaction extends Model {}

TokenTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users", // name of the table, not the model
        key: "id",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false, // 'initial', 'patreon', etc.
    },
  },
  {
    sequelize,
    modelName: "TokenTransaction",
    tableName: "token_transactions",
    timestamps: false,
  }
);

module.exports = TokenTransaction;
