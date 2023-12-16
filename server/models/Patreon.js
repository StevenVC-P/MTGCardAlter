const { DataTypes, Model } = require("sequelize");

const sequelize = require("../config/database");

class Patreon extends Model {}

Patreon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patreon_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    total_pledged: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Patreon",
    tableName: "patreon_accounts",
    timestamps: false,
  }
);

module.exports = Patreon;
