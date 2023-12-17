import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosSetup";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImagesAndCards = async () => {
      setLoading(true); // Begin loading
      setError(null);   // Reset error state
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token available');
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };

        const imagesResponse = await axios.get('http://localhost:5000/api/generated-images/user', config);
        setCardData(imagesResponse.data); // Update card data with the response
        setLoading(false); // Loading complete
      } catch (error) {
        setError(error);  // Set error if there is a problem fetching data
        setLoading(false); // Loading complete
      }
    };

    fetchImagesAndCards();
  }, []);

  // Modify deleteCard to handle deletion from the database
const deleteCard = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('No access token available.');
    // Optionally handle the absence of an access token (e.g., redirect to login)
    return;
  }

  try {
    // Ensure you're sending the correct identifier to your endpoint.
    // If your endpoint requires the image ID, you should send that instead of cardId.
    await axios.delete(`http://localhost:5000/api/generated-images/${cardId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Update state to reflect deletion.
    // This assumes cardData is an array of card objects and each card object has an images array.
    console.log(cardData)
    const updatedCardData = cardData.filter(card => card.card.user_card_id !== cardId);

    setCardData(updatedCardData);

  } catch (error) {
    console.error('Failed to delete image:', error);
    // Handle the error appropriately, such as showing a message to the user
  }
};

  function selectComponentForFace(face, imageData) {
    if (face.type_line.includes('Saga')) {
      return <Saga card={face} imageData={imageData} />;
    } else if (face.type_line.includes('Battle')) {
      return <Battle card={face} imageData={imageData} />;
    } else {
      return <BasicFrame card={face} imageData={imageData} />;
    }
  }
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
            {loading && <div>Loading cards...</div>} {/* Show loading message when fetching data */}
            {error && <div>Error loading cards: {error.message}</div>}

            {!loading && !error && cardData.map((data) => {
            
              // Access the image URL safely
              const imageUrls = data.images?.length > 0 ? data.images.map(img => img.image_url) : ['fallback-image-url'];

              // Log the imageData to see what value is being passed to the BasicFrame component
              const CardComponent = () => {
                if (data.card_details.keywords && data.card_details.keywords.includes('Aftermath')) {
                  return <Aftermath card={data.card_details} imageData={imageUrls} />;
                } else {
                  switch (data.card_details.layout) {
                    case 'normal':
                    return <BasicFrame card={data.card_details} imageData={imageUrls} />;
                    case 'split':
                      return <SplitFrame card={data.card_details} imageData={imageUrls} />;
                    case 'adventure':
                      return <Adventure card={data.card_details} imageData={imageUrls} />;
                    case 'saga':
                      return <Saga card={data.card_details} imageData={imageUrls} />;
                    case 'flip':
                      return <FlipFrame card={data.card_details} imageData={imageUrls} />;
                    case 'transform':
                      const faceIndex = data.card.face_type === 'front' ? 0 : 1;
                      const faceData = data.card_details.card_faces[faceIndex];
                      const combinedCardData = { ...data.card_details, ...faceData };

                      return selectComponentForFace(combinedCardData, imageUrls)

                    default:
                      return <BasicFrame card={data.card} imageData={imageUrls}/>;
                    }
                  }
                };
              return (
                <div className="card-box" key={data.card.user_card_id}>
                  <CardComponent />
                  <button className="delete-button" onClick={() => deleteCard(data.card.user_card_id)}>Delete Card</button>

                </div>
              );
            })}
        </div>
      </div>
  );
};

export default CardForm;