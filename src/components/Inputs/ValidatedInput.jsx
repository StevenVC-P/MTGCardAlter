import React, { useState } from 'react';

const ValidatedInput = ({ type, placeholder, value, onChange, validator, errorMessage, shouldValidate }) => {
  const [validationMessage, setValidationMessage] = useState('');

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (shouldValidate && validator && typeof validator === 'function') {
      setValidationMessage(validator(inputValue) ? '' : errorMessage);
    }
    onChange(e);
  };

  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
      {validationMessage && <small>{validationMessage}</small>}
    </div>
  );
};

export default ValidatedInput;
