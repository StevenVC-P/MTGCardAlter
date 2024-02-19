import React, { useState, useEffect } from 'react';

const RightSidebar = ({ counter, errorMessage }) => {
  const [localErrorMessage, setLocalErrorMessage] = useState(errorMessage);

  useEffect(() => {
    if (errorMessage) { // Only update if there's a new error message
      setLocalErrorMessage(errorMessage);
    }
  }, [errorMessage]);

  const renderErrorMessages = () => {
    if (typeof localErrorMessage === "object") {
      return (
        <ul>
          {Object.entries(localErrorMessage).map(([key, values]) => (
            <li key={key}>
              {key}: {values.join(', ')}
            </li>
          ))}
        </ul>
      );
    } else {
      return localErrorMessage;
    }
  };

  const clearErrors = () => {
    setLocalErrorMessage(null); // Clears the local error message state
  };

  return (
    <div className="right-bar sidebar">
      <div className="counter-section">
        <label htmlFor="counter-value">Cards Available</label>
        <span id="counter-value">{counter}</span>
      </div>

      {localErrorMessage && 
        <div className="error-message">
          <label htmlFor="error-message">Error:</label>
          <span id="error-message">{renderErrorMessages()}</span>
          <button onClick={clearErrors} className="clear-errors-button">Clear Errors</button>
        </div>
      }

      {/* <div className="message-section">
        <label htmlFor="placeholder-message">Message:</label>
        <p id="placeholder-message">The page is limited to 10 cards at a time.</p>
      </div> */}
    </div>
  );
};

export default RightSidebar;
