import React, { useState } from 'react';
import { friendlyLabelNames, friendlyOptionNames, stylePresetFriendlyNames } from '../Shared/Constants';
const CollapsibleSection = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {label}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

const LeftSidebar = ({
  text,
  weight,
  setText,
  setWeight,
  otherValues,
  setOtherValues,
  engineValues,
  setEngineValues
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
    const value = Number(event.target.value);
    setOtherValues(prevValues => ({
      ...otherValues,
      [key]: value
    }));
  };

  const renderSlider = (label, key) => (
    <div className="slider-container">
      <label htmlFor={key}>
        {label}: {otherValues[key] !== undefined ? otherValues[key] : 5}
      </label>
      <input
        type="range"
        id={key}
        name={key}
        min="0"
        max="10"
        value={otherValues[key] !== undefined ? otherValues[key] : 5}
        onChange={(e) => handleSliderChange(e, key)}
      />
    </div>
  );

  const handleEngineValueChange = (event, key) => {
    const value = 
      key === 'stylePreset' || key === 'clip_guidance_preset' || key === 'sampler'
        ? event.target.value 
        : Number(event.target.value);
    setEngineValues(prevValues => ({
      ...prevValues,
      [key]: value
    }));
  };

  const renderEngineSlider = (label, key, min, max, step) => (
    <div className="slider-container">
      <label htmlFor={key}>
        {label}: {engineValues[key]}
      </label>
      <input
        type="range"
        id={key}
        name={key}
        min={min}
        max={max}
        step={step}
        value={engineValues[key]}
        onChange={(e) => handleEngineValueChange(e, key)}
      />
    </div>
  );

  const renderDropdown = (key, options) => {
    const friendlyLabel = friendlyLabelNames[key] || key;
    
    return (
      <div className="dropdown-container">
        <label htmlFor={key}>{friendlyLabel}:</label>
        <select
          id={key}
          value={engineValues[key]}
          onChange={(e) => handleEngineValueChange(e, key)}
        >
          {options.map(option => {
            // Use the getFriendlyName function from constants for options
            const friendlyName = friendlyOptionNames[option] || stylePresetFriendlyNames[option] || option;
            return <option key={option} value={option}>{friendlyName}</option>;
          })}
        </select>
      </div>
    );
  };
    
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

      <CollapsibleSection label="Advanced Prompt Features">
        {renderSlider('Color', 'color')}
        {renderSlider('Type Line', 'typeLine')}
        {renderSlider('Keywords', 'keywords')}
        {renderSlider('Tokens', 'tokens')}
      </CollapsibleSection>

      <CollapsibleSection label="Advanced Engine Features">
        {renderEngineSlider('Adherence to Prompt', 'cfg_scale', 0, 35, 1)}
        {renderEngineSlider('Detail Level', 'steps', 10, 50, 1)}
        {renderDropdown(
          'clip_guidance_preset', 
          ['FAST_BLUE', 'FAST_GREEN', 'NONE', 'SIMPLE', 'SLOW', 'SLOWER', 'SLOWEST']
        )}
        {renderDropdown(
          'sampler', 
          ['DDIM', 'DDPM', 'K_DPMPP_2M', 'K_DPM_2_5_ANCESTRAL', 'K_DPM_2', 'K_DPM_2_ANCESTRAL', 'K_EULER', 'K_EULER_ANCESTRAL', 'K_HEUN', 'K_LMS']
        )}
        {renderDropdown(
          'stylePreset', 
          ['3d-model', 'analog-film', 'anime', 'cinematic', 'comic-book', 'digital-art', 'enhance', 'fantasy-art', 'isometric', 'line-art', 'low-poly', 'modeling-compound', 'neon-punk', 'origami', 'photographic', 'pixel-art', 'tile-texture']
        )}
      </CollapsibleSection>
    </div>
  );
};

export default LeftSidebar;
