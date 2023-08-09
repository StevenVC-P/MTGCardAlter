import React, { useState } from 'react';
import axios from 'axios';
import generateImageForCard from '../../helpers/imgGenerator';

const CardInputForm = ({ setCardData, setImages }) => {
  const [cardNames, setCardNames] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sanitizeInput = (input) => {
    let quantity;
    let cardName;

    const match = input.match(/^(\d+)[x\s-]*(.+)/);
    if (match) {
      quantity = parseInt(match[1], 10) || 1;
      cardName = match[2].trim();
    } else {
      quantity = 1;
      cardName = input.trim();
    }
    let sanitizedCardName = cardName
      .replace(/\//g, '%2F')
      .replace(/\\/g, '%5C');

    return { quantity, sanitizedCardName };
  };

  const handleClear = () => {
    setCardNames([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const cardNamesArr = cardNames.split('\n').filter((name) => name !== '');
    let newImages = {};

    for (const cardName of cardNamesArr) {
      try {
        let { quantity, sanitizedCardName } = sanitizeInput(cardName);

        const response = await axios.get(`http://localhost:5000/api/cards/${sanitizedCardName}`);
        let imageData = await generateImageForCard(response);

        for (let i = 0; i < quantity; i++) {
          const key = `${sanitizedCardName}-${i}`;
          newImages[key] = imageData;
          setCardData((prevCardData) => [...prevCardData, { ...response.data, imageKey: key }]);
          await delay(100);
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    }

    setCardNames('');
    setImages((prevImages) => ({ ...prevImages, ...newImages }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea onChange={e => setCardNames(e.target.value)} value={cardNames} className="input-box" placeholder="Copy/Paste Magic card names and quantities" />
      <button type="submit" className="submit-button">
        Submit
      </button>
      <button type="button" className="clear-button" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
};

export default CardInputForm;
