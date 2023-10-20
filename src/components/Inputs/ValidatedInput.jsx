import React, { useState } from 'react';

const ValidatedInput = ({ type, placeholder, value, onChange, validator, errorMessage, shouldValidate, className }) => {
  const [validationMessage, setValidationMessage] = useState('');

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (shouldValidate && validator && typeof validator === 'function') {
      setValidationMessage(validator(inputValue) ? '' : errorMessage);
    }
    onChange(e);
  };

  return (
    <div className="validated-input-container">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={className}
      />
      {validationMessage && <small className="validation-error">{validationMessage}</small>}
    </div>
  );
};

export default ValidatedInput;
