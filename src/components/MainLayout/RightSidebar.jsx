import React from 'react';

const RightSidebar = ({ counter }) => {
  return (
    <div className="right-bar">
      <h2>Right Bar</h2>
      
      <div className="counter-section">
        <span>Counter Value: {counter}</span>
      </div>
      
      <div className="message-section">
        <p>Message: placeholder</p>
      </div>
    </div>
  );
};

export default RightSidebar;
