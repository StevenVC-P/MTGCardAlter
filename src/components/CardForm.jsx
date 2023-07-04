import React, { useState } from "react";
import BasicFrame from "./Templates/BasicFrame";
import SplitFrame from "./Templates/SplitFrame";
import Aftermath from "./Templates/Aftermath";
import Adventure from "./Templates/Adventure";
import Saga from "./Templates/Saga";
import axios from "axios";

const CardForm = () => {
  const [cardNames, setCardNames] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [isImageGenerationEnabled, setImageGenerationEnabled] = useState(true);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sanitizeInput = (input) => {
    let quantity;
    let sanitizedCardName;

    const match = input.match(/^(\d+)[x\s-]*(.+)/);
    if (match) {
      quantity = parseInt(match[1], 10) || 1;  // quantity is in match[1]
      sanitizedCardName = match[2].trim();  // card name is in match[2]
    } else {
      quantity = 1;  // default quantity is 1
      sanitizedCardName = input.trim();
    }

    return { quantity, sanitizedCardName };
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCardData([]);
    const cardNamesArr = cardNames.split('\n').filter(name => name !== '');

    for (const cardName of cardNamesArr) {
      try {
        let {quantity, sanitizedCardName} = sanitizeInput(cardName);
        for(let i = 0; i < quantity; i++) {
          const response = await axios.get(`http://localhost:5000/api/cards/${sanitizedCardName}`);
          setCardData(prevCardData => [...prevCardData, response.data]);
          await delay(100); // Adding a delay of 100ms between requests
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    }
    setCardNames("");
  };

  const handleCheckboxChange = (event) => {
    setImageGenerationEnabled(event.target.checked);
    console.log("steve", event.target.checked)
  };

  const handleInputChange = (event) => {
    setCardNames(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea onChange={handleInputChange} value={cardNames} className="input-box" placeholder="Copy/Paste Magic card names and quantities" />
        <br />
        <label>
          Enable image generation:
          <input type="checkbox" checked={isImageGenerationEnabled} onChange={handleCheckboxChange} />
        </label>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <div id="card-results">
        {cardData.map((card, index) => {
          // Find Frame based on card.layout
          let result = [];
          
          if (card.keywords.includes('Aftermath')) {
            result = <Aftermath key={index} card={card} isImageGenerationEnabled={isImageGenerationEnabled} />;
          } else {
            switch (card.layout) {
              case 'normal':
                result.push(<BasicFrame key={index} card={card} isImageGenerationEnabled={isImageGenerationEnabled} />)
                break;
              case 'split':
                result.push(<SplitFrame key={index} card={card} isImageGenerationEnabled={isImageGenerationEnabled} />)
                break;
              case 'adventure':
                result.push(<Adventure key={index} card={card} isImageGenerationEnabled={isImageGenerationEnabled} />)
                break
              case 'saga':
                result.push(<Saga key={index} card={card} isImageGenerationEnabled={isImageGenerationEnabled} />)
                break
              case 'transform':
                //since card_faces is an arrary, we can iterate over it and then place each result into the higher array (cardData.map makes).
                //The final key is will be a string like '1-1' or '3-0'
                card.card_faces.forEach((face, faceIndex) => {
                  if (face.type_line.includes('Saga')) {
                    result.push(<Saga key={`${index}-${faceIndex}`} card={card} face={face} isImageGenerationEnabled={isImageGenerationEnabled} />);
                  } else {
                    result.push(<BasicFrame key={`${index}-${faceIndex}`} card={card} face={face} isImageGenerationEnabled={isImageGenerationEnabled} />);
                  }
                });
                break;
              default:
                result.push(<BasicFrame key={index} card={card} isImageGenerationEnabled={isImageGenerationEnabled} />)
                break;
            }
          }

          return result
        })}
      </div>
    </div>
  );
};

export default CardForm;
