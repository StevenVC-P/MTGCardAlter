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
const CardForm = ({ sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, isLoading, setIsLoading, setErrorMessage }) => {
  // Using React's useState hook for managing state
  const [cardData, setCardData] = useState([]);
  // const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  setIsDeleting(prevState => ({ ...prevState, [cardId]: true }));
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('No access token available.');
    setIsDeleting(prevState => ({ ...prevState, [cardId]: false }))
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/generated-images/${cardId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const updatedCardData = cardData.filter(card => card.card.user_card_id !== cardId);

    setCardData(updatedCardData);
    setIsDeleting(prevState => {
      const newState = { ...prevState };
      delete newState[cardId];  // Remove cardId from the state
      return newState;
    });
  } catch (error) {
    console.error('Failed to delete image:', error);
    setIsDeleting(prevState => ({ ...prevState, [cardId]: false }));
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
          cardData={cardData}
          setCardData={setCardData} 
          sidebarText={sidebarText} 
          sidebarWeight={sidebarWeight} 
          otherValues={otherValues} 
          engineValues={engineValues}
          decrementCounter={decrementCounter} 
          counter={counter} 
          setErrorMessage={setErrorMessage}
          currentCardCount={cardData.length}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
          <div id="card-results">
            {loading && <div>Loading cards...</div>} {/* Show loading message when fetching data */}
            {error && <div>Error loading cards: {error.message}</div>}

            {!loading && !error && cardData.map((data) => {
            
              // Access the image URL safely
              const imageUrls = data.images?.length > 0 ? data.images.map(img => img.image_url) : ['fallback-image-url'];

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
                    case 'planar':
                      return <Battle card={data.card_details} imageData={imageUrls} />;
                    case 'double_faced_token':
                    case 'reversible_card':
                    case 'modal_dfc':
                    case 'transform':
                      const faceIndex = data.card.face_type === 'front' ? 0 : 1;
                      const faceData = data.card_details.card_faces[faceIndex];
                      const combinedCardData = { ...data.card_details, ...faceData };

                      return selectComponentForFace(combinedCardData, imageUrls)

                    default:
                      return <BasicFrame card={data.card_details} imageData={imageUrls}/>;
                    }
                  }
                };
              return (
                <div className="card-box" key={data.card.user_card_id}>
                  <CardComponent />
                  <button 
                    className="delete-button"
                    onClick={() => deleteCard(data.card.user_card_id)}
                    disabled={isDeleting[data.card.user_card_id] || isLoading}
                  >
                    Delete Card
                  </button>
                </div>
              );
            })}
        </div>
      </div>
  );
};

export default CardForm;