import React, { useState } from "react";
import Card from "./Card";
import axios from "axios";

const CardForm = () => {
  const [cardNames, setCardNames] = useState([]);
  const [cardData, setCardData] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCardData([]);
    const cardNamesArr = cardNames.split('\n').filter(name => name !== '');

    for (const cardName of cardNamesArr) {
      try {
        const response = await axios.get(`http://localhost:5000/api/cards/${cardName}`);
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
        {cardData.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default CardForm;
