const pool = require("../db");

class Card {
    static async getById(cardId) {
        const [rows] = await pool.execute("SELECT * FROM Cards WHERE card_id = ?", [cardId]);
        return rows.length ? rows[0] : null;
    }

    static async getByName(cardName) {
        const [cardRows] = await pool.execute("SELECT * FROM Cards WHERE name LIKE ?", [`%${cardName}%`]);

        if (cardRows.length === 0) {
        return null;
        }

        const exactMatch = cardRows.find((card) => card.name === cardName);
        if (exactMatch) {
        return await this.getAdditionalData(exactMatch);
        }

        const splitMatch = cardRows.filter((card) => card.name.split(" // ").includes(cardName));
        if (splitMatch.length > 0) {
        // Assuming you want additional data for the first match
        return await this.getAdditionalData(splitMatch[0]);
        }

        return null;
    }

    static async getAdditionalData(card) {
    const [colorRows] = await pool.execute("SELECT color FROM CardColors WHERE card_id = ?", [card.card_id]);
    card.colors = colorRows.map((row) => row.color);

    // Fetch related keywords
    const [keywordRows] = await pool.execute("SELECT keyword FROM Keywords WHERE card_id = ?", [card.card_id]);
    card.keywords = keywordRows.map((row) => row.keyword);

    const [CardColorIdentities] = await pool.execute("SELECT color_identity FROM CardColorIdentities WHERE card_id = ?  ORDER BY id ASC", [card.card_id]);
    card.color_identity = CardColorIdentities.map((row) => row.color_identity);

    // For CardFaces table, assuming you want to collect `name`, `type_line` etc.
    const [CardFaces] = await pool.execute("SELECT id, name, type_line, mana_cost, oracle_text, watermark, power, toughness FROM CardFaces WHERE card_id = ? ORDER BY id ASC", [card.card_id]);
    card.card_faces = CardFaces.map((row) => ({ id: row.id, name: row.name, type_line: row.type_line, mana_cost: row.mana_cost, oracle_text: row.oracle_text, watermark: row.watermark, power: row.power, toughness: row.toughness }));

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
