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
        console.log(response.data);
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
          let result;
          
          if (card.keywords.includes('Aftermath')) {
            result = <Aftermath key={index} card={card} />;
          } else {
            switch (card.layout) {
              case 'normal':
                result = <BasicFrame key={index} card={card} />
                break;
              case 'split':
                result = <SplitFrame key={index} card={card} />
                break;
              case 'adventure':
                result = <Adventure key={index} card={card} />
                break
              case 'saga':
                result = <Saga key={index} card={card} />
                break
              default:
                result = <BasicFrame key={index} card={card} />
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
