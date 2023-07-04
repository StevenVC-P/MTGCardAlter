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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  const sanitizeInput = (input) => {
    return input
      .replace(/\//g, '%2F')  // replace / with %2F
      .replace(/\\/g, '%5C'); // replace \ with %5C
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCardData([]);
    const cardNamesArr = cardNames.split('\n').filter(name => name !== '');

    for (const cardName of cardNamesArr) {
      try {
        let sanitizedCardName = sanitizeInput(cardName);

        const response = await axios.get(`http://localhost:5000/api/cards/${sanitizedCardName}`);

        setCardData(prevCardData => [...prevCardData, response.data]);
        await delay(100); // Adding a delay of 100ms between requests
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    }
    setCardNames("");
  };

  const handleInputChange = (event) => {
    setCardNames(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea onChange={handleInputChange} value={cardNames} className="input-box" placeholder="Copy/Paste Magic card names and quantities" />
        <br />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <div id="card-results">
        {cardData.map((card, index) => {
          // Find Frame based on card.layout
          let result = [];
          
          if (card.keywords.includes('Aftermath')) {
            result = <Aftermath key={index} card={card} />;
          } else {
            switch (card.layout) {
              case 'normal':
                result.push(<BasicFrame key={index} card={card} imageBase64={card.imageBase64}/>)
                break;
              case 'split':
                result.push(<SplitFrame key={index} card={card} />)
                break;
              case 'adventure':
                result.push(<Adventure key={index} card={card} />)
                break
              case 'saga':
                result.push(<Saga key={index} card={card} />)
                break
              case 'transform':
                //since card_faces is an arrary, we can iterate over it and then place each result into the higher array (cardData.map makes).
                //The final key is will be a string like '1-1' or '3-0'
                card.card_faces.forEach((face, faceIndex) => {
                  if (face.type_line.includes('Saga')) {
                    result.push(<Saga key={`${index}-${faceIndex}`} card={card} face={face} />);
                  } else {
                    result.push(<BasicFrame key={`${index}-${faceIndex}`} card={card} face={face} />);
                  }
                });
                break;
              default:
                result.push(<BasicFrame key={index} card={card} />)
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
