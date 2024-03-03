import React, { useState } from 'react';
import generateImageForCard from '../../helpers/imgGenerator';
import axiosInstance from '../../utils/axiosConfig.js';
import ConfirmationModal from '../Shared/ConfirmationModal.jsx';

const CardInputForm = ({ cardData, setCardData, sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, setErrorMessage, isLoading, setIsLoading }) => {
  const [cardNames, setCardNames] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleClearConfirm = async() => {
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await axiosInstance.patch('/api/generated-images/soft-delete-all-cards', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
        });
      if (response.data.success) {
  
      setCardNames(""); 
      setCardData([]); 
    }

    } catch (error) {
      console.error(error); 
    } finally {
      setIsModalOpen(false)
    }
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
  const [tempCardData, localCategorizedErrors] = await processCardNames(cardNamesArr);

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

  setIsLoading(true);

  const decrementSlotsAndCounter = (count) => {
    counter -= count;
    decrementCounter(count);
  };
  let totalImages = 0;
  for (const cardName of cardNamesArr) {
    if (counter === 0) {
      setErrorMessage("Counter is at 0, not making a request.");
      break;
    }
    const { quantity, sanitizedCardName } = sanitizeInput(cardName);

    try {
      const response = await axiosInstance.get(`/api/cards/name/${sanitizedCardName}`);
      if (response.status === 200) {
        const newCardObjects = await generateImageForCard(response, sidebarText, sidebarWeight, otherValues, engineValues, counter);

        

        for (const cardObject of newCardObjects) {
          console.log("cardObject.images.length: ", cardObject.images.length)
         totalImages = totalImages + cardObject.images.length
          console.log("totalImages: ", totalImages)
          for (let i = 0; i < quantity; i++) {
              const cardDataPromise = {
                card_details: response.data, 
                images: cardObject.images, 
                card: cardObject.card 
              };
              tempCardData.push(cardDataPromise);           
          }
          
        }

         
      }
    } catch (error) {
      console.error("Caught an error:", error);
      handleRequestError(error, cardName, localCategorizedErrors);
    }
  }
  decrementSlotsAndCounter(totalImages); 
  setIsLoading(false);
  return [tempCardData, localCategorizedErrors];
};


const handleRequestError = (error, cardName, localCategorizedErrors) => {
  let errorMessage = "An error occurred. Please try again.";
  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message;
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    errorMessage += " The DreamStudio API may be down. Check the API status here: https://dreamstudio.com/api/status/";
  }

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

  const isSubmitDisabled = !cardNames.trim() || isLoading;

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
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            onConfirm={handleClearConfirm}
          >
            Clear All Cards
          </button>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleClearConfirm}
          message="Are you sure you want to clear all your generated cards? This action cannot be undone."
        />
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