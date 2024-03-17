import React, { useState, useEffect } from "react";
import BasicFrame from "../Templates/BasicFrame";
import SplitFrame from "../Templates/SplitFrame";
import Aftermath from "../Templates/Aftermath";
import Adventure from "../Templates/Adventure";
import FlipFrame from "../Templates/FlipFrame";
import Battle from "../Templates/Battles";
import Saga from "../Templates/Saga";
import CardInputForm from "../Inputs/CardInputForms"; 
import axiosInstance from "../../utils/axiosConfig.js";


// Main function component for the form
const CardForm = ({ sidebarText, sidebarWeight, otherValues, engineValues, decrementCounter, counter, isLoading, setIsLoading, setErrorMessage }) => {
  // Using React's useState hook for managing state
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  

    // Calculate total pages
  const totalPages = Math.ceil(cardData.length / itemsPerPage);

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
    // Slice the cardData for the current page
  const currentCards = cardData.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers for pagination controls
  const goToNextPage = () => setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => setCurrentPage(currentPage - 1);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  useEffect(() => {
    const fetchImagesAndCards = async () => {
      setLoading(true);
      setError(null); 
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

        const imagesResponse = await axiosInstance.get('/api/generated-images/user', config);
        setCardData(imagesResponse.data); 
        setLoading(false);
      } catch (error) {
        setError(error); 
        setLoading(false);
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
    await axiosInstance.delete(`/api/generated-images/${cardId}`, {
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
          {loading && <div>Loading cards...</div>}
          {error && <div>Error loading cards: {error.message}</div>}

          {!loading && !error && currentCards.map((data) => {
            // Access the image URL safely
            const imageUrls = data.images?.length > 0 ? data.images.map(img => img.image_url) : ['fallback-image-url'];
            console.log("data: ", data)
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
                  case 'art_series':
                  case 'transform':
                    const faceIndex = data.card.face_type === 'front' ? 0 : 1;
                    const faceData = data.card_details.card_faces[faceIndex];
                    const combinedCardData = { 
                      ...data.card_details,
                      ...Object.fromEntries(Object.entries(faceData).map(([key, value]) => [`${key}`, value])) 
                    };
                    return selectComponentForFace(combinedCardData, imageUrls, )

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
        <div className="pagination-controls">
          <button onClick={goToFirstPage} disabled={currentPage === 1}>First</button>
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
          <button onClick={goToLastPage} disabled={currentPage === totalPages}>Last</button>
        </div>
      </div>
  );
};

export default CardForm;