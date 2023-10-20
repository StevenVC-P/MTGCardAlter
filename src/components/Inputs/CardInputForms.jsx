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
      // Splitting user input into an array of card names
      const cardNamesArr = cardNames.split('\n').filter(name => name !== '');
      let newImages = {};
      let newCardCounts = { ...cardCounts }; // Make a copy of the current counts

      let tempCardData = [];

      for (const cardName of cardNamesArr) {
        console.log(cardName, " ", currentCounter)
        if (currentCounter === 0) {
          console.warn("Counter is at 0, not making a request.");
          setErrorMessage("Counter is at 0, not making a request.");
          break;
        }
        try {
          let {quantity, sanitizedCardName} = sanitizeInput(cardName);

          const response = await axios.get(`http://localhost:5000/api/cards/name/${sanitizedCardName}`);
          let imageData = await generateImageForCard(response, sidebarText, sidebarWeight, counter);

          if (imageData.error) {
              console.error(imageData.error);
              // You can use some kind of state management to display the error message under the counter
              setErrorMessage(imageData.error); 
              continue; // Skip this loop iteration to avoid decrementing the counter and other operations.
          }
          console.log(cardName, " 1 ", currentCounter)
          currentCounter --
          console.log(cardName, " 2 ", currentCounter)
          decrementCounter();
          // Creating new card objects based on the quantity
          for(let i = 0; i < quantity; i++) {
            // Get the current count for the card name, and increment it
            const count = (newCardCounts[sanitizedCardName] || 0) + 1;
            newCardCounts[sanitizedCardName] = count;

            // Creating a unique key for each card object
            const key = `${sanitizedCardName}-${count}`;

            // Saving the image to the newImages object
            newImages[key] = imageData;
            tempCardData.push({...response.data, imageKey: key});
            await delay(100);
          }
        } catch (error) {
          console.error("Error fetching card data:", error);
        }
      }

      // Update the cardData state with the temporary array
      setCardData(prevCardData => [...prevCardData, ...tempCardData]);
      // Update the cardCounts state
      setCardCounts(newCardCounts);

      // Clearing the input and saving the new images to the images state
      setCardNames("");
      setImages(prevImages => ({...prevImages, ...newImages}));
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