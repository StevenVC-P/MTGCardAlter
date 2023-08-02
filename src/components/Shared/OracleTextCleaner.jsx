// OracleText.jsx

import React from 'react';
import { manaSymbols } from './ManaSymbols'; // adjust this path to point to your ManaSymbols.js

const OracleTextCleaner = ({ text, className }) => {
    if (!text) return null;
  // Regex to match the curly braces and the content inside them
  const regex = /{([^}]+)}/g;
  let matches;
  let parts = [];
  let lastIndex = 0;

  while ((matches = regex.exec(text)) !== null) {
    // Add text before the match
    if (matches.index > lastIndex) {
      parts.push(text.slice(lastIndex, matches.index));
    }

    // Remove "/" from the match result and convert to uppercase
    const iconName = matches[1].replace(/\//g, "").toUpperCase();
    const iconPath = manaSymbols[`${iconName}.jpg`];

    // Add image in place of the match
    parts.push(<img key={matches.index} src={`${iconPath}`} alt={iconName} className="mana-icon"/>);

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return (
        <p className={`oracle_text ${className || ''}`}>
            {parts}
        </p>
  );
};

export default OracleTextCleaner;
