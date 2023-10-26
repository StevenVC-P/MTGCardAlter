import React from 'react';

const LeftSidebar = ({
  text,
  weight,
  setText,
  setWeight,
  otherValues,
  setOtherValues,
}) => {
  const handleTextInputChange = (event) => {
    const pattern = /^[a-zA-Z0-9\s.,!?'"()]*$/;
    if (pattern.test(event.target.value)) {
      setText(event.target.value);
    }
  };

  const handleWeightChange = (event) => {
    setWeight(Number(event.target.value));
  };

  const handleSliderChange = (event, key) => {
    setOtherValues({
      ...otherValues,
      [key]: Number(event.target.value),
    });
  };

  const renderSlider = (label, key) => (
    <div className="slider-container">
      <label htmlFor={key}>
        {label}: {otherValues[key]}
      </label>
      <input
        type="range"
        id={key}
        name={key}
        min="0"
        max="10"
        value={otherValues[key] || 5}
        onChange={(e) => handleSliderChange(e, key)}
      />
    </div>
  );

  return (
    <div className="sidebar">
      <label htmlFor="text-input">Enter a custom prompt here:</label>
      <textarea
        id="text-input"
        value={text}
        onChange={handleTextInputChange}
        rows="10"
        cols="30"
        placeholder="Type here..."
      />
      <label htmlFor="weight">Prompt: {weight}</label>
      <input
        type="range"
        id="weight"
        name="weight"
        min="0"
        max="10"
        value={weight}
        onChange={handleWeightChange}
      />
      {renderSlider('Card Name', 'cardName')}
      {renderSlider('Color', 'color')}
      {renderSlider('Type Line', 'typeLine')}
      {renderSlider('Keywords', 'keywords')}
      {renderSlider('Tokens', 'tokens')}
    </div>
  );
};

export default LeftSidebar;
