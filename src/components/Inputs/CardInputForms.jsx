import React, { useState } from 'react';
import axios from "../../utils/axiosSetup";
import generateImageForCard from '../../helpers/imgGenerator';

const CardInputForm = ({ setCardData, setImages, sidebarText, sidebarWeight, decrementCounter, counter,setErrorMessage }) => {
  const [cardNames, setCardNames] = useState([]);
  const [cardCounts, setCardCounts] = useState({});

  let currentCounter = counter;
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
    setCardData([]);
    setImages({});
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (counter === 0) {
    console.warn("Counter is at 0, not making a request.");
    setErrorMessage("Counter is at 0, not making a request.");
    return;
  }

  const cardNamesArr = cardNames.split('\n').filter(name => name.trim() !== '');
  let newImages = {};
  let newCardCounts = { ...cardCounts };

  let tempCardData = [];

  try {
    for (const cardName of cardNamesArr) {
      if (currentCounter === 0) {
        console.warn("Counter is at 0, not making a request.");
        setErrorMessage("Counter is at 0, not making a request.");
        break;
      }

      const { quantity, sanitizedCardName } = sanitizeInput(cardName);
      const response = await axios.get(`http://localhost:5000/api/cards/name/${sanitizedCardName}`);

      if (response.status === 200) {
        const imageData = await generateImageForCard(response, sidebarText, sidebarWeight, counter);

        if (imageData.error) {
          console.error(imageData.error);
          setErrorMessage(imageData.error);
          continue;
        }

        currentCounter--;
        decrementCounter();

        const cardDataPromises = Array.from({ length: quantity }, async () => {
          const count = (newCardCounts[sanitizedCardName] || 0) + 1;
          newCardCounts[sanitizedCardName] = count;
          const key = `${sanitizedCardName}-${count}`;
          newImages[key] = imageData;
          await delay(100);
          return { ...response.data, imageKey: key };
        });

        tempCardData.push(...await Promise.all(cardDataPromises));
      }
    }
  } catch (error) {
    console.error("Error fetching card data:", error);
    let errorMessage = "An error occurred. Please try again.";

    if (error.response && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    setErrorMessage(errorMessage);
  }

  setCardData(prevCardData => [...prevCardData, ...tempCardData]);
  setCardCounts(newCardCounts);
  setCardNames("");
  setImages(prevImages => ({ ...prevImages, ...newImages }));
};

  return (
    <form className={"main-form"} onSubmit={handleSubmit}>
      <div className={"form-buttons"}>
        <button type="submit" className="submit form-button">
          Submit
        </button>
        <button type="button" className="clear form-button" onClick={handleClear}>
          Clear
        </button>
      </div>
      <textarea onChange={e => setCardNames(e.target.value)} value={cardNames} className="input-box" placeholder="Copy/Paste Magic card names and quantities" />

    </form>
  );
};

export default CardInputForm;