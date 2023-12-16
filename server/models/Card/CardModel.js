const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class CardModel extends Model {}

CardModel.init(
  {
    card_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    oracle_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    mtgo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tcgplayer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cardmarket_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mana_cost: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type_line: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    oracle_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    flavor_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    power: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    toughness: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    watermark: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    artist: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    loyalty: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    released_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uri: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scryfall_uri: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    layout: {
      type: DataTypes.TEXT,
      allowNull: false, // Assuming this is not nullable as per SQL
    },
    cmc: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    rarity: {
      type: DataTypes.TEXT,
      allowNull: false, // Assuming this is not nullable as per SQL
    },
    border_color: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    set_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    set_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    set_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    set_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    oversized: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    promo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    reprint: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    variation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    digital: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    booster: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    story_spotlight: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    edhrec_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    penny_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Card",
    tableName: "Cards",
    timestamps: false,
  }
);

module.exports = CardModel;
