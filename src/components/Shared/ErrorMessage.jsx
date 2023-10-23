import React from 'react';

const ErrorComponent = ({ errorMessage, onClearError }) => {
    if (!errorMessage) return null;

    // Display categorized errors
    const displayCategorizedErrors = () => {
        return Object.keys(errorMessage).map(errorType => {
            return (
                <div key={errorType}>
                    <strong>{errorType}:</strong>
                    <ul>
                        {errorMessage[errorType].map(cardName => (
                            <li key={cardName}>{cardName}</li>
                        ))}
                    </ul>
                </div>
            );
        });
    };

    return (
        <div className="error-container">
            {typeof errorMessage === 'string' 
                ? <p>{errorMessage}</p> 
                : displayCategorizedErrors()
            }
            <button onClick={onClearError}>Clear Error</button>
        </div>
    );
}

export default ErrorComponent;