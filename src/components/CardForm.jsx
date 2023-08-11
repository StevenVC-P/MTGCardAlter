import React, { useState } from "react";
import axios from "axios";
import generateImageForCard from '../helpers/imgGenerator';
import BasicFrame from "./Templates/BasicFrame";
import SplitFrame from "./Templates/SplitFrame";
import Aftermath from "./Templates/Aftermath";
import Adventure from "./Templates/Adventure";
import FlipFrame from "./Templates/FlipFrame";
import Battle from "./Templates/Battles";
import Saga from "./Templates/Saga";

// Main function component for the form
const CardForm = () => {
  // Using React's useState hook for managing state
  const [cardNames, setCardNames] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [cardCounts, setCardCounts] = useState({});
  const [images, setImages] = useState({});
  
   // This function helps to create delay or pause execution for certain milliseconds
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Sanitizes the card name input and separates quantity
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

    return {quantity, sanitizedCardName}
  }

  // Function to clear the current data
  const handleClear = () => {
    setCardNames([]);
    setCardData([]);
    setImages({});
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      
      // Splitting user input into an array of card names
      const cardNamesArr = cardNames.split('\n').filter(name => name !== '');
      let newImages = {};
      let newCardCounts = { ...cardCounts }; // Make a copy of the current counts

      for (const cardName of cardNamesArr) {
        try {
          let {quantity, sanitizedCardName} = sanitizeInput(cardName);

          const response = await axios.get(`http://localhost:5000/api/cards/${sanitizedCardName}`);
          let imageData = await generateImageForCard(response);

          // Creating new card objects based on the quantity
          for(let i = 0; i < quantity; i++) {
            // Get the current count for the card name, and increment it
            const count = (newCardCounts[sanitizedCardName] || 0) + 1;
            newCardCounts[sanitizedCardName] = count;

            // Creating a unique key for each card object
            const key = `${sanitizedCardName}-${count}`;

            // Saving the image to the newImages object
            newImages[key] = imageData;
            setCardData(prevCardData => [...prevCardData, {...response.data, imageKey: key}]);
            await delay(100);
          }
        } catch (error) {
          console.error("Error fetching card data:", error);
        }
      }

      // Update the cardCounts state
      setCardCounts(newCardCounts);

      // Clearing the input and saving the new images to the images state
      setCardNames("");
      setImages(prevImages => ({...prevImages, ...newImages}));
  };

  const handleInputChange = (event) => {
    setCardNames(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea onChange={handleInputChange} value={cardNames} className="input-box" placeholder="Copy/Paste Magic card names and quantities" />
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button type="button" className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </form>
      <div id="card-results">
        {cardData.map((card) => {
          const imageData = images[card.imageKey];

          const Component = () => {
            if (card.keywords.includes('Aftermath')) {
              return <Aftermath card={card} imageData={imageData}/>;
            } else {
              switch (card.layout) {
                case 'normal':
                  return <BasicFrame card={card} imageData={imageData}/>;
                case 'split':
                  return <SplitFrame card={card} imageData={imageData}/>;
                case 'adventure':
                  return <Adventure card={card} imageData={imageData}/>;
                case 'saga':
                  return <Saga card={card} imageData={imageData}/>;
                case 'flip':
                  return <FlipFrame card={card} imageData={imageData}/>;
                case 'transform':
                  return card.card_faces.map((face, faceIndex) => {
                    let faceKey = `${card.imageKey}-${faceIndex}`;
                    let safeImageData = imageData || {};
                    let faceImageData = {
                      image: faceIndex === 0 ? safeImageData.firstImage : safeImageData.secondImage
                    };
                    if (face.type_line.includes('Saga')) {
                      return <Saga key={faceKey} card={card} face={face} imageData={faceImageData}/>;
                    } else if (face.type_line.includes('Battle')) {
                      return <Battle key={faceKey} card={card} face={face} imageData={faceImageData}/>;
                    }
                    else {
                      return <BasicFrame key={faceKey} card={card} face={face} imageData={faceImageData}/>;
                    }
                  });
                default:
                  return <BasicFrame card={card} imageData={imageData}/>;
              }
            }
          };
          return (
            <React.Fragment key={card.imageKey}>
              <Component />
            </React.Fragment>
          );
          })}
      </div>
    </div>
  );
};

export default CardForm;
