const pool = require("../db");

class Card {
  static async getById(cardId) {
    const [rows] = await pool.execute("SELECT * FROM Cards WHERE card_id = ?", [cardId]);
    return rows.length ? rows[0] : null;
  }

  static async getByName(cardName) {
    const [cardRows] = await pool.execute("SELECT * FROM Cards WHERE name = ?", [cardName]);
    if (cardRows.length === 0) {
      return null;
    }
    const card = cardRows[0];

    // Fetch related colors
    const [colorRows] = await pool.execute("SELECT color FROM CardColors WHERE card_id = ?", [card.card_id]);
    card.colors = colorRows.map((row) => row.color);

    // Fetch related keywords
    const [keywordRows] = await pool.execute("SELECT keyword FROM Keywords WHERE card_id = ?", [card.card_id]);
    card.keywords = keywordRows.map((row) => row.keyword);

    const [CardColorIdentities] = await pool.execute("SELECT color_identity FROM CardColorIdentities WHERE card_id = ?", [card.card_id]);
    card.color_identity = CardColorIdentities.map((row) => row.color_identity);

    // For CardFaces table, assuming you want to collect `name`, `type_line` etc.
    const [CardFaces] = await pool.execute("SELECT name, type_line FROM CardFaces WHERE card_id = ?", [card.card_id]);
    card.card_faces = CardFaces.map((row) => ({ name: row.name, type_line: row.type_line, mana_cost: row.mana_cost, oracle_text: row.oracle_text, watermark: row.watermark }));

    // For RelatedCards table, assuming you want to collect `related_card_id`, `component` etc.
    const [RelatedCards] = await pool.execute("SELECT related_card_id, component FROM RelatedCards WHERE card_id = ?", [card.card_id]);
    card.relatedCards = RelatedCards.map((row) => ({ related_card_id: row.related_card_id, component: row.component }));

    // For Legalities table, assuming you want to collect `format_name`, `legality`
    const [Legalities] = await pool.execute("SELECT format_name, legality FROM Legalities WHERE card_id = ?", [card.card_id]);
    card.legalities = Legalities.map((row) => ({ format_name: row.format_name, legality: row.legality }));

    // For Games table, assuming you want to collect `game`
    const [Games] = await pool.execute("SELECT game FROM Games WHERE card_id = ?", [card.card_id]);
    card.games = Games.map((row) => row.game);

    // Add more related data as needed
    return card;
  }

  static async getAll() {
    const [rows] = await pool.execute("SELECT * FROM Cards");
    return rows;
  }
  // More methods depending on your needs
}
module.exports = Card;
