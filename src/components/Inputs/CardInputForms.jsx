import React, { useState } from 'react';
import axios from "../../utils/axiosSetup";
import generateImageForCard from '../../helpers/imgGenerator';

const CardInputForm = ({ cardData, setCardData, sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, setErrorMessage, isLoading, setIsLoading }) => {
  const [cardNames, setCardNames] = useState("");
  const [categorizedErrors, setCategorizedErrors] = useState({});

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
    setCardNames("");
    setCardData([]);

    localStorage.removeItem('cardImages');
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  const slotsRemaining = 10 - cardData.length;
  if (!isValidInput(sidebarText, sidebarWeight, otherValues)) {
    return;
  }

  if (counter === 0) {
    setErrorMessage("Counter is at 0, not making a request.");
    return;
  }

  const cardNamesArr = getSanitizedCardNames(cardNames);
  const cardNamesToProcess = cardNamesArr.slice(0, slotsRemaining);
  const [tempCardData, localCategorizedErrors] = await processCardNames(cardNamesToProcess);

  if (Object.keys(localCategorizedErrors).length) {
    setErrorMessage(localCategorizedErrors);
  } else {
    setErrorMessage("");
  }

  updateStates(tempCardData);
};

const isValidInput = (sidebarText, sidebarWeight, otherValues) => {
  if ((sidebarText.trim() === '' || sidebarWeight === 0) && otherValues.cardName === 0) {
    setErrorMessage("'Prompt' or 'Card Name' must have a value and weight.");
    return false;
  }
  return true;
};

const getSanitizedCardNames = (cardNames) => {
  return cardNames.split('\n').filter(name => name.trim() !== '');
};

const processCardNames = async (cardNamesArr) => {
  let tempCardData = [];
  let localCategorizedErrors = {};
  let slotsRemaining  = 10-cardData.length;

  setIsLoading(true);

  const decrementSlotsAndCounter = (count) => {
    counter -= count;
    decrementCounter(count);
  };

  for (const cardName of cardNamesArr) {
    if (counter === 0) {
      setErrorMessage("Counter is at 0, not making a request.");
      break;
    }
    const { quantity, sanitizedCardName } = sanitizeInput(cardName);
    const effectiveQuantity = Math.min(quantity, slotsRemaining );

    try {
      const response = await axios.get(`http://localhost:5000/api/cards/name/${sanitizedCardName}`);
      if (response.status === 200) {
        const newCardObjects = await generateImageForCard(response, sidebarText, sidebarWeight, otherValues, engineValues, counter);

        for (const cardObject of newCardObjects) {
          decrementSlotsAndCounter(1); 
          for (let i = 0; i < effectiveQuantity; i++) {
            if (slotsRemaining > 0) {
              const cardDataPromise = {
                card_details: response.data, 
                images: cardObject.images, 
                card: cardObject.card 
              };
              slotsRemaining--;
              tempCardData.push(cardDataPromise);
            }
            
          }
        }
      }
    } catch (error) {
      console.error("Caught an error:", error);
      handleRequestError(error, cardName, localCategorizedErrors);
    }
  }
  setIsLoading(false);
  return [tempCardData, localCategorizedErrors];
};

const handleImageError = (error, cardName, localCategorizedErrors) => {
  if (!localCategorizedErrors[error]) {
    localCategorizedErrors[error] = [];
  }
  localCategorizedErrors[error].push(cardName);
};

const handleRequestError = (error, cardName, localCategorizedErrors) => {
  let errorMessage = "An error occurred. Please try again.";
  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message;
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    errorMessage += " The DreamStudio API may be down. Check the API status here: https://dreamstudio.com/api/status/";
  }

  setErrorMessage(errorMessage);

  if (!localCategorizedErrors[errorMessage]) {
    localCategorizedErrors[errorMessage] = [];
  }
  localCategorizedErrors[errorMessage].push(cardName);
};

const updateStates = (tempCardData) => {
  setCardData(prevCardData => [...tempCardData, ...prevCardData]);
  setCardNames("");
};

  const handleInputChange = (e) => {
    setCardNames(e.target.value);
  };

  const isSubmitDisabled = !cardNames.trim() ||cardData.length >= 10 || isLoading;

  return (
    <div className="form-wrapper">
      <form className={"main-form"} onSubmit={handleSubmit}>
        <div className={"form-buttons"}>
          <button 
            type="submit" 
            className="submit form-button"
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
          <button 
            type="button"
            className="clear form-button"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
        <textarea 
          onChange={handleInputChange} // Use the new handler
          value={cardNames} // Join the array into a string for the textarea
          className="input-box" 
          placeholder="Copy/Paste Magic card names and quantities" 
        />
      </form>
    </div>
  );
};

export default CardInputForm;