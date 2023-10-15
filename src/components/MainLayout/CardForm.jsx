import React, { useState } from "react";
import BasicFrame from "../Templates/BasicFrame";
import SplitFrame from "../Templates/SplitFrame";
import Aftermath from "../Templates/Aftermath";
import Adventure from "../Templates/Adventure";
import FlipFrame from "../Templates/FlipFrame";
import Battle from "../Templates/Battles";
import Saga from "../Templates/Saga";
import CardInputForm from "../Inputs/CardInputForms"; 

import { FixedSizeGrid as Grid } from 'react-window';

const CardComponent = ({ card, imageData }) => {
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

// Main function component for the form
const CardForm = ({ sidebarText, sidebarWeight }) => {
  const [cardData, setCardData] = useState([]); // Assuming your card data
  const [images, setImages] = useState({}); // Assuming your image data

  const CARD_WIDTH = 250;
  const CARD_HEIGHT = 350;
  const NUM_COLUMNS = 3;

  const renderCell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * NUM_COLUMNS + columnIndex;
    if (index >= cardData.length) return null; // Return empty if index is outside the range of data

    const card = cardData[index];
    const imageData = images[card.imageKey];

    return (
      <div style={style} key={card.imageKey}>
        <CardComponent card={card} imageData={imageData} />
      </div>
    );
  };

  return (
    <div className="card-form-container">
      <CardInputForm setCardData={setCardData} setImages={setImages} sidebarText={sidebarText} sidebarWeight={sidebarWeight}/>
      <div id="card-results">
        <Grid
          columnCount={NUM_COLUMNS}
          columnWidth={CARD_WIDTH}
          rowCount={Math.ceil(cardData.length / NUM_COLUMNS)}
          rowHeight={CARD_HEIGHT}
          width={CARD_WIDTH * NUM_COLUMNS} // Container width
          height={600} // Adjust based on how many rows you want to display
        >
          {renderCell}
        </Grid>
      </div>
    </div>
  );
};

export default CardForm;