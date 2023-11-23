import React, { useState, useEffect } from "react";
import BasicFrame from "../Templates/BasicFrame";
import SplitFrame from "../Templates/SplitFrame";
import Aftermath from "../Templates/Aftermath";
import Adventure from "../Templates/Adventure";
import FlipFrame from "../Templates/FlipFrame";
import Battle from "../Templates/Battles";
import Saga from "../Templates/Saga";
import CardInputForm from "../Inputs/CardInputForms"; 

// Main function component for the form
const CardForm = ({ sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, setErrorMessage }) => {
  // Using React's useState hook for managing state
  const [cardData, setCardData] = useState([]);
  const [images, setImages] = useState({});

    // Load images from local storage when the component mounts
  useEffect(() => {
    try {
      const savedCardData = JSON.parse(localStorage.getItem('cardData'));
      const savedImages = JSON.parse(localStorage.getItem('cardImages'));
      if (savedImages) {
        setImages(savedImages);
      }
      if (savedCardData) {
        setCardData(savedCardData);
      }
    } catch (error) {
      console.error('Failed to load data from local storage:', error);
      // Handle the error appropriately
    }
  }, []);

  // Save card data and images to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cardImages', JSON.stringify(images));
    localStorage.setItem('cardData', JSON.stringify(cardData));
  }, [images, cardData]);

  const deleteCard = (imageKey) => {
    // Remove card from cardData and images state
    const updatedCardData = cardData.filter(card => card.imageKey !== imageKey);
    const updatedImages = { ...images };
    delete updatedImages[imageKey];

    setCardData(updatedCardData);
    setImages(updatedImages);

    // Update local storage
    localStorage.setItem('cardData', JSON.stringify(updatedCardData));
    localStorage.setItem('cardImages', JSON.stringify(updatedImages));
  };

   // This function helps to create delay or pause execution for certain milliseconds
  return (
    <div className="card-form-container">
      <CardInputForm 
        setCardData={setCardData} 
        setImages={setImages} 
        sidebarText={sidebarText} 
        sidebarWeight={sidebarWeight} 
        otherValues={otherValues} 
        engineValues={engineValues}
        decrementCounter={decrementCounter} 
        counter={counter} 
        setErrorMessage={setErrorMessage}
        currentCardCount={cardData.length}
      />
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
          <div className="card-box" key={card.imageKey}>
            <Component />
            <button className="delete-button" onClick={() => deleteCard(card.imageKey)}>Delete Card</button>
          </div>
          );
          })}
      </div>
    </div>
  );
};

export default CardForm;