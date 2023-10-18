const { Sequelize, DataTypes, Model } = require("sequelize");

// Assuming you have a sequelize instance set up already
const sequelize = new Sequelize("arcane_proxies", "username", "root", {
  host: "localhost",
  dialect: "mysql",
});

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    google_id: DataTypes.STRING(50),
    facebook_id: DataTypes.STRING(50),
    patreon_id: DataTypes.STRING(50),
    remaining_images: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
