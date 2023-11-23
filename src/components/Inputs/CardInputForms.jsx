import React, { useState } from 'react';
import axios from "../../utils/axiosSetup";
import generateImageForCard from '../../helpers/imgGenerator';

const CardInputForm = ({ setCardData, setImages, sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, setErrorMessage }) => {
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
    console.log(cardNames)


    if ((sidebarText.trim() === '' || sidebarWeight === 0) && otherValues.cardName === 0) {
      console.log("inside warning")
      console.warn("'Prompt' or 'Card Name' must have a value and weight.");
      setErrorMessage("'Prompt' or 'Card Name' must have a value and weight.");
      return;
    }

    if (counter === 0) {
      console.warn("Counter is at 0, not making a request.");
      setErrorMessage("Counter is at 0, not making a request.");
      return;
    }

    const cardNamesArr = cardNames.split('\n').filter(name => name.trim() !== '');
    let newImages = {};
    let newCardCounts = { ...cardCounts };

    let tempCardData = [];
    let localCategorizedErrors = {};

    for (const cardName of cardNamesArr) {
      if (currentCounter === 0) {
        console.warn("Counter is at 0, not making a request.");
        setErrorMessage("Counter is at 0, not making a request.");
        break;
      }

      const { quantity, sanitizedCardName } = sanitizeInput(cardName);

      try {
      const response = await axios.get(`http://localhost:5000/api/cards/name/${sanitizedCardName}`);
        // const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${sanitizedCardName}`);
        if (response.status === 200) {
          const imageData = await generateImageForCard(response, sidebarText, sidebarWeight, otherValues, engineValues, counter);
        if (imageData.error) {
          // Detect specific DreamStudio API timeout error
          if (imageData.error === 'DreamStudio API timeout') {
            setErrorMessage(`The DreamStudio API is currently experiencing issues. Please check their status at https://dreamstudio.com/api/status/`);
          } else {
            setErrorMessage(imageData.error); // Set a generic error message
          }
          console.low(imageData.error);
          if (!localCategorizedErrors[imageData.error]) {
            localCategorizedErrors[imageData.error] = [];
          }
          localCategorizedErrors[imageData.error].push(cardName);
          continue; // Skip the current iteration as an error has occurred
        }
          const numberOfImages = Object.keys(imageData).length;
          currentCounter -= numberOfImages;
          decrementCounter(numberOfImages);

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
      } catch (error) {
        let errorMessage = "An error occurred. Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        // Provide a link to check DreamStudio API status if it's a timeout error
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorMessage += " The DreamStudio API may be down. Check the API status here: https://dreamstudio.com/api/status/";
        }

        setErrorMessage(errorMessage); // Update the user-facing error message

        if (!localCategorizedErrors[errorMessage]) {
          localCategorizedErrors[errorMessage] = [];
        }
        localCategorizedErrors[errorMessage].push(cardName);
      }
    }

    if (Object.keys(localCategorizedErrors).length) {
      setErrorMessage(localCategorizedErrors);
    } else {
      setErrorMessage(""); // Clear any previous error messages
    }
    setCardData(prevCardData => [...prevCardData, ...tempCardData]);
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
    <form className={"main-form"} onSubmit={handleSubmit}>
      <div className={"form-buttons"}>
        <button 
          type="submit" 
          className="submit form-button"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
        <button type="button" className="clear form-button" onClick={handleClear}>
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
  );
};

export default CardInputForm;