import React from 'react';

const RightSidebar = ({ counter, errorMessage }) => {
  return (
    <div className="right-bar sidebar">
      <div className="counter-section">
        <label htmlFor="counter-value">Cards Available</label> {/* Added label for consistency */}
        <span id="counter-value">{counter}</span>
      </div>

      {errorMessage && 
        <div className="error-message">
          <label htmlFor="error-message">Error:</label> {/* Added label for consistency */}
          <span id="error-message">{errorMessage}</span>
        </div>
      }

      <div className="message-section">
        <label htmlFor="placeholder-message">Message:</label> {/* Added label for consistency */}
        <p id="placeholder-message">The page is limited to 10 cards at a time.</p>
      </div>
    </div>
  );
};

export default RightSidebar;
