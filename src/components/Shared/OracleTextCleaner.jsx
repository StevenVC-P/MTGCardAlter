import React from 'react';
import { manaSymbols } from './ManaSymbols'; // adjust this path to point to your ManaSymbols.js
import { stylingFormatter } from '../../helpers/stylingFormatter';

const OracleTextCleaner = ({ text, className, type_line }) => {
  if (!text) return null;

  // Regex to match the curly braces and the content inside them
  const regex = /{([^}]+)}/g;

  // Extract styling rules based on text content and type
  let { fontSize, textAlign, alignItems, display, justifyContent, flexDirection, iconSize, width, height } = stylingFormatter(type_line, className, text);
  
  // Split the text into lines first
  const lines = text.split('\n');
const finalParts = lines.map((line, lineIndex) => {
  const parts = [];
  let lastIndex = 0;
  let iconSequence = [];

  // Find mana symbols in the current line
  line.replace(regex, (match, iconName, offset) => {
    if (offset > lastIndex) {
      parts.push(line.slice(lastIndex, offset));
    }

    iconName = iconName.replace(/\//g, "").toUpperCase();
    const iconPath = manaSymbols[`${iconName}.jpg`];

// Check if followed by a colon and if that colon is followed by a space or if it's a comma, or end of line
    if ((line[offset + match.length] === ':' && (line[offset + match.length + 1] === ' ' || offset + match.length + 1 === line.length))
        || line[offset + match.length] === ',' || offset + match.length === line.length) {
      if (iconSequence.length > 0) {
        parts.push(<span key={`icon-sequence-${offset}`} style={{ display: 'inline-block', flexDirection: 'row' }}>{iconSequence}</span>);
        iconSequence = [];
      }
      parts.push(
        <img key={offset} src={`${iconPath}`} alt={iconName} className="mana-icon" style={{ height: iconSize, width: iconSize }} />,
      );
    } else {
      iconSequence.push(
        <img key={offset} src={`${iconPath}`} alt={iconName} className="mana-icon" style={{ height: iconSize, width: iconSize }} />,
      );
    }
    lastIndex = offset + match.length;
  });

    if (iconSequence.length > 0) {
      parts.push(<span key={`icon-sequence-${line.length}`} style={{ display: 'inline-block' }}>{iconSequence}</span>);
    }

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

  return (
    <div className={`textcontainer`} style={containerStyle}>
      <p className={`oracle_text ${className || ''}`} style={{ fontSize, textAlign, alignItems, display, flexDirection, justifyContent, width }}>
        <span style={{ display, flexDirection, justifyContent, alignItems, width, height }}>
          {finalParts}
        </span>
      </p>
    </div>
  );
};

export default OracleTextCleaner;
