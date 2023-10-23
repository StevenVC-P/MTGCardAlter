const { pool } = require("../../db");
class Card {
  static async getById(cardId) {
    const [rows] = await pool.execute("SELECT * FROM Cards WHERE card_id = ?", [cardId]);
    return rows.length ? rows[0] : null;
  }

  static async getByName(cardName) {
  const lowerCaseCardName = cardName.toLowerCase();

    const query = `
    SELECT * FROM Cards 
    WHERE name LIKE ? 
    ORDER BY 
        CASE 
            WHEN name = ? THEN 1 
            ELSE 2 
        END, 
        name ASC 
    LIMIT 1;
  `;

    const [cardRows] = await pool.query(query, [`%${lowerCaseCardName}%`, lowerCaseCardName]);

    if (cardRows.length === 0) {
      throw new Error(`No card matches found for these names:`);
    }

    const exactMatch = cardRows.find((card) => card.name.toLowerCase() === lowerCaseCardName);
    if (exactMatch) {
      return await this.getAdditionalData(exactMatch);
    }
    const splitMatch = cardRows.filter((card) => card.name.split(" // ").includes(lowerCaseCardName));
    if (splitMatch.length > 0) {
      return await this.getAdditionalData(splitMatch[0]);
    }
    return null;
  }

  static async getAdditionalData(card) {
    const fetchColorQuery = "SELECT color FROM CardColors WHERE card_id = ?";
    const fetchKeywordQuery = "SELECT keyword FROM Keywords WHERE card_id = ?";
    const fetchColorIdentityQuery = "SELECT color_identity FROM CardColorIdentities WHERE card_id = ? ORDER BY id ASC";
    const fetchCardFacesQuery = "SELECT id, name, type_line, mana_cost, oracle_text, watermark, power, toughness FROM CardFaces WHERE card_id = ? ORDER BY id ASC";
    const fetchRelatedCardsQuery = "SELECT related_card_id, component, name FROM RelatedCards WHERE parent_card_name = ?";
    const fetchLegalitiesQuery = "SELECT format_name, legality FROM Legalities WHERE card_id = ?";
    const fetchGamesQuery = "SELECT game FROM Games WHERE card_id = ?";

    const [colorRows] = await pool.execute(fetchColorQuery, [card.card_id]);
    card.colors = colorRows.map((row) => row.color);

    const [keywordRows] = await pool.execute(fetchKeywordQuery, [card.card_id]);
    card.keywords = keywordRows.map((row) => row.keyword);

    const [cardColorIdentities] = await pool.execute(fetchColorIdentityQuery, [card.card_id]);
    card.color_identity = cardColorIdentities.map((row) => row.color_identity);

    const [cardFaces] = await pool.execute(fetchCardFacesQuery, [card.card_id]);
    card.card_faces = cardFaces.map((row) => ({
      id: row.id,
      name: row.name,
      type_line: row.type_line,
      mana_cost: row.mana_cost,
      oracle_text: row.oracle_text,
      watermark: row.watermark,
      power: row.power,
      toughness: row.toughness,
    }));

    const [relatedCards] = await pool.execute(fetchRelatedCardsQuery, [card.name]);

    // Post-process the SQL results to remove duplicates.
    const uniqueRelatedCards = relatedCards
      .filter((row) => row.component === "token")
      .reduce((acc, row) => {
        if (!acc.some((item) => item.name === row.name)) {
          acc.push({
            related_card_id: row.related_card_id,
            name: row.name,
            component: row.component,
          });
        }
        return acc;
      }, []);

    // Assign the unique related cards to your card object.
    card.relatedCards = uniqueRelatedCards;

    const [legalities] = await pool.execute(fetchLegalitiesQuery, [card.card_id]);
    card.legalities = legalities.map((row) => ({
      format_name: row.format_name,
      legality: row.legality,
    }));

    const [games] = await pool.execute(fetchGamesQuery, [card.card_id]);
    card.games = games.map((row) => row.game);

    return card;
  }

  static async getAll() {
    const [rows] = await pool.execute("SELECT * FROM Cards");
    return rows;
  }
  // More methods depending on your needs
}
module.exports = Card;
