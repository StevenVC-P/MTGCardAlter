import React, { useState } from 'react';
import axios from "../../utils/axiosSetup";
import generateImageForCard from '../../helpers/imgGenerator';
import LoadingBanner from '../MainLayout/LoadingBanner';

const CardInputForm = ({ setCardData, setImages, sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, setErrorMessage, isLoading, setIsLoading }) => {
  const [cardNames, setCardNames] = useState("");
  const [cardCounts, setCardCounts] = useState({});
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
    setImages({});

    localStorage.removeItem('cardImages');
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!isValidInput(sidebarText, sidebarWeight, otherValues)) {
    return;
  }

  if (counter === 0) {
    setErrorMessage("Counter is at 0, not making a request.");
    return;
  }

  const cardNamesArr = getSanitizedCardNames(cardNames);
  const [newImages, newCardCounts, tempCardData, localCategorizedErrors] = await processCardNames(cardNamesArr);

  if (Object.keys(localCategorizedErrors).length) {
    setErrorMessage(localCategorizedErrors);
  } else {
    setErrorMessage("");
  }

  updateStates(newImages, newCardCounts, tempCardData);
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
  let newImages = {};
  let newCardCounts = { ...cardCounts };
  let tempCardData = [];
  let localCategorizedErrors = {};
  setIsLoading(true);

  for (const cardName of cardNamesArr) {
    if (counter === 0) {
      setErrorMessage("Counter is at 0, not making a request.");
      break;
    }

    const { quantity, sanitizedCardName } = sanitizeInput(cardName);

    try {
      const response = await axios.get(`http://localhost:5000/api/cards/name/${sanitizedCardName}`);
      if (response.status === 200) {
        const newCardObjects = await generateImageForCard(response, sidebarText, sidebarWeight, otherValues, engineValues, counter);

        newCardObjects.forEach(cardObject => {
          counter -= 1;
          decrementCounter(1);

          for (let i = 0; i < quantity; i++) {
            const cardDataPromise = {
              card_details: response.data, 
              images: cardObject.images, 
              card: cardObject.card 
            };
            tempCardData.push(cardDataPromise);
          }
        });
      }
    } catch (error) {
      console.error("Caught an error:", error);
      handleRequestError(error, cardName, localCategorizedErrors);
    } finally {
        setIsLoading(false);
    };
  }

  return [newImages, newCardCounts, tempCardData, localCategorizedErrors];
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

const updateStates = (newImages, newCardCounts, tempCardData) => {
  setCardData(prevCardData => [...tempCardData, ...prevCardData]);
  setCardCounts(newCardCounts);
  setCardNames("");
  setImages(prevImages => ({ ...prevImages, ...newImages }));
};

  const handleInputChange = (e) => {
    setCardNames(e.target.value);
  };

  const cardImagesFromStorage = JSON.parse(localStorage.getItem('cardImages') || '{}');
  const isSubmitDisabled = !cardNames.trim() || Object.keys(cardImagesFromStorage).length >= 10;


  return (
    <div className="form-wrapper">
      <form className={"main-form"} onSubmit={handleSubmit}>
        <div className={"form-buttons"}>
          <button 
            type="submit" 
            className="submit form-button"
            disabled={isSubmitDisabled || isLoading}
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