import React, { useState } from "react";
import BasicFrame from "./Templates/BasicFrame";
import SplitFrame from "./Templates/SplitFrame";
import Aftermath from "./Templates/Aftermath";
import Adventure from "./Templates/Adventure";
import FlipFrame from "./Templates/FlipFrame";
import Battle from "./Templates/Battles";
import Saga from "./Templates/Saga";
import CardInputForm from "../components/Inputs/CardInputForms"; 

// Main function component for the form
const CardForm = () => {
  // Using React's useState hook for managing state
  const [cardData, setCardData] = useState([]);
  const [images, setImages] = useState({});

  return (
    <div>
      <CardInputForm setCardData={setCardData} setImages={setImages} />
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
