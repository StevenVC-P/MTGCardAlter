import json
import pymysql

# Initialize the database connection
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='root',
    database='arcane_proxies',
    autocommit=False  # Disable autocommit to handle transactions manually
)

cursor = connection.cursor()

try:
    # Prepare batches
    card_batch = []
    card_color_batch = []
    card_color_identity_batch = []
    keyword_batch = []
    card_face_batch = []
    card_prices_batch = []
    related_cards_batch = []

    # Read from the JSON file
    with open('all-cards.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for card in data:
        # Prepare the Cards batch
        card_batch.append((
            card['id'], card.get('oracle_id'), card.get('mtgo_id'), card.get(
                'tcgplayer_id'), card.get('cardmarket_id'),
            card['name'], card.get('mana_cost'), card.get(
                'type_line'), card.get('oracle_text'), card.get('flavor_text'), card.get('power'),
            card.get('toughness'), card.get('watermark'), card.get(
                'artist'), card['lang'], card.get('loyalty'), card.get('released_at'),
            card.get('uri'), card.get('scryfall_uri'), card['layout'], card.get(
                'cmc'), card.get('rarity'),
            card.get('border_color'), card.get('set_id'), card.get(
                'set_code'), card.get('set_name'), card.get('set_type'),
            card.get('oversized'), card.get('promo'), card.get(
                'reprint'), card.get('variation'), card.get('digital'),
            card.get('booster'), card.get('story_spotlight'), card.get(
                'edhrec_rank'), card.get('penny_rank')
        ))

        # Prepare the CardColors batch
        if 'colors' in card:
            for color in card['colors']:
                card_color_batch.append((card['id'], color))

        # Prepare the CardColorIdentities batch
        if 'color_identity' in card:
            for color_identity in card['color_identity']:
                card_color_identity_batch.append((card['id'], color_identity))

        # Prepare the Keywords batch
        if 'keywords' in card:
            for keyword in card['keywords']:
                keyword_batch.append((card['id'], keyword))

        # Prepare the CardFaces batch
        if 'card_faces' in card:
            for face in card['card_faces']:
                card_face_batch.append((
                    card['id'], face.get('name'), face.get(
                        'mana_cost'), face.get('type_line'),
                    face.get('oracle_text'), face.get('power'), face.get(
                        'toughness'), face.get('loyalty'), face.get('defense'), face.get('watermark'), face.get('artist')
                ))

        # Prepare the CardPrices batch
        if 'prices' in card:
            prices = card['prices']
            card_prices_batch.append((
                card['id'], prices.get('usd'), prices.get(
                    'usd_foil'), prices.get('usd_etched'),
                prices.get('eur'), prices.get('eur_foil'), prices.get('tix')
            ))

        # Prepare the RelatedCards batch
        if 'all_parts' in card:
            for part in card['all_parts']:
                related_cards_batch.append((
                    card['name'], part['id'], part['component'], part['name'], part['type_line']
                ))
    print(f"Inserting card with ID: {card['id']}")
    # Execute batch queries

    # Insert Cards
    card_query = """INSERT INTO Cards (
        card_id, oracle_id, mtgo_id, tcgplayer_id, cardmarket_id, name, mana_cost, 
        type_line, oracle_text, flavor_text, power, toughness, watermark, artist, lang, loyalty, released_at, uri,
        scryfall_uri, layout, cmc, rarity, border_color, set_id, set_code, set_name, set_type, oversized,
        promo, reprint, variation, digital, booster, story_spotlight, edhrec_rank, penny_rank
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)"""
    cursor.executemany(card_query, card_batch)

    # Insert CardColors
    card_color_query = "INSERT INTO CardColors (card_id, color) VALUES (%s, %s)"
    cursor.executemany(card_color_query, card_color_batch)

    # Insert CardColorIdentities
    card_color_identity_query = "INSERT INTO CardColorIdentities (card_id, color_identity) VALUES (%s, %s)"
    cursor.executemany(card_color_identity_query, card_color_identity_batch)

    # Insert Keywords
    keyword_query = "INSERT INTO Keywords (card_id, keyword) VALUES (%s, %s)"
    cursor.executemany(keyword_query, keyword_batch)

    # Insert CardFaces
    card_face_query = "INSERT INTO CardFaces (card_id, name, mana_cost, type_line, oracle_text, power, toughness, loyalty, defense, watermark, artist) VALUES (%s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.executemany(card_face_query, card_face_batch)

    # Insert CardPrices
    card_prices_query = "INSERT INTO CardPrices (card_id, usd, usd_foil, usd_etched, eur, eur_foil, tix) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    cursor.executemany(card_prices_query, card_prices_batch)

        # Insert RelatedCards
    # Insert into RelatedCards table
    related_cards_values = []
    for card in data:
        if 'all_parts' in card:
            for part in card['all_parts']:
                related_cards_values.append(
                    (card['id'], card['name'], part['id'], part.get('component'),
                     part.get('name'), part.get('type_line'))
                )

    # Formulate query string for RelatedCards
    related_cards_query = """
    INSERT INTO RelatedCards (card_id, parent_card_name, related_card_id, component, name, type_line)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE card_id=VALUES(card_id), parent_card_name=VALUES(parent_card_name), related_card_id=VALUES(related_card_id), component=VALUES(component), name=VALUES(name), type_line=VALUES(type_line);
    """
    cursor.executemany(related_cards_query, related_cards_values)
    print("Inserted into RelatedCards table successfully.")
    # Commit the changes
    connection.commit()
    print("Committed changes to the database.")
except pymysql.MySQLError as e:
    print(f"An SQL error occurred: {e}")
    connection.rollback()

except Exception as e:
    print(f"An error occurred: {e}")
    connection.rollback()

finally:
    # Close the database connection
    cursor.close()
    connection.close()
