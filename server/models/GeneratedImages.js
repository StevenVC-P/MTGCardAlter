const {DataTypes, Model } = require("sequelize");

const sequelize = require("../config/database");

class GeneratedImage extends Model {}

GeneratedImage.init(
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_card_id: {
      // New field to reference UserCards
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "UserCards", // This should match the table name of UserCards
        key: "user_card_id",
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cfg_scale: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    clip_guidance_preset: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sampler: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    steps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    style_preset: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "GeneratedImage",
    tableName: "GeneratedImages",
    timestamps: false, // if you don't have updatedAt and createdAt as separate fields
  }
);

module.exports = GeneratedImage;
