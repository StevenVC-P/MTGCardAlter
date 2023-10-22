import React from 'react';

const ErrorComponent = ({ errorMessage, onClearError }) => {
    if (!errorMessage) return null;

    return (
        <div className="error-container">
            <p>{errorMessage}</p>
            <button onClick={onClearError}>Clear Error</button>
        </div>
    );
}

export default ErrorComponent;
