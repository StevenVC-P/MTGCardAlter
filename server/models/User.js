const { Sequelize, DataTypes, Model } = require("sequelize");

// Assuming you have a sequelize instance set up already
const sequelize = require("../config/database");

class User extends Model {
  static async getUserById(id) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async updateUserTokens(id, newTokenCount) {
    try {
      const user = await this.findByPk(id);
      if (!user) {
        return null;
      }
      user.tokens = newTokenCount;
      await user.save();
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

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
    tokens: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true, // Token is nullable
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true, // Expiry date is nullable
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
