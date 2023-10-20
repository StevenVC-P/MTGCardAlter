import React from 'react';

const LeftSidebar = ({text, weight, setText, setWeight}) => {

    const handleTextInputChange = (event) => {
        // Only allow characters used in normal writing
        const pattern = /^[a-zA-Z0-9\s.,!?'"()]*$/;
        if (pattern.test(event.target.value)) {
        setText(event.target.value); // using the prop function
        }
    };


    const handleWeightChange = (event) => {
        setWeight(Number(event.target.value)); // using the prop function
    };


  return (
    <div className="sidebar">
      <label htmlFor="text-input">Enter a custom prompt here:</label>
      <textarea
        id="text-input"
        value={text} // using the prop value
        onChange={handleTextInputChange}
        rows="10"
        cols="30"
        placeholder="Type here..."
      />
      <label htmlFor="weight">Weight: {weight}</label>
      <input
        type="range"
        id="weight"
        name="weight"
        min="1"
        max="10"
        value={weight} // using the prop value
        onChange={handleWeightChange}
      />
    </div>
  );
};

export default LeftSidebar;
