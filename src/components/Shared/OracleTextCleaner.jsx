import React from 'react';
import { manaSymbols } from './ManaSymbols'; // adjust this path to point to your ManaSymbols.js
import { stylingFormatter } from '../../helpers/stylingFormatter';

const OracleTextCleaner = ({ text, className, type_line, layout, flavortext }) => {
  if (!text) return null;

  // Regex to match the curly braces and the content inside them
  const regex = /{([^}]+)}/g;

  // Extract styling rules based on text content and type
  let { fontSize, textAlign, alignItems, display, justifyContent, flexDirection,
    iconSize, width, height, marginLeft, marginTop, marginRight } = stylingFormatter(type_line, className, text, layout, flavortext);
  // Split the text into lines first
  const lines = text.split('\n');
  const finalParts = lines.map((line, lineIndex) => {
    const parts = [];
    let lastIndex = 0;

    // Find mana symbols in the current line
    line.replace(regex, (match, iconName, offset) => {
      if (offset > lastIndex) {
        parts.push(line.slice(lastIndex, offset));
      }

      iconName = iconName.replace(/\//g, "").toUpperCase();
      const iconPath = manaSymbols[`${iconName}.jpg`];

      parts.push(
        <img key={offset} src={`${iconPath}`} alt={iconName} className="mana-icon" style={{ height: iconSize, width: iconSize }} />,
      );

      lastIndex = offset + match.length;
    });

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return (
      <span key={`line-${lineIndex}`}>
        {parts}
        {lineIndex < lines.length - 1 && <br key={`br-${lineIndex}`} />}
      </span>
    );
  });

  const containerStyle = className === 'saga_text' ? { height: 'auto' } : {};
  const containerClass = type_line && type_line.includes("Planeswalker") ? 'planeswalker_textcontainer' : 'textcontainer';
  return (
    <div className={containerClass} style={containerStyle}>
      <p className={`oracle_text ${className || ''}`} style={{ fontSize, textAlign, alignItems, display, flexDirection, justifyContent, width, marginLeft, marginTop, marginRight }}>
        <span style={{ display, flexDirection, justifyContent, alignItems, width, height }}>
          {finalParts}
        </span>
      </p>
    </div>
  );
};

export default OracleTextCleaner;
