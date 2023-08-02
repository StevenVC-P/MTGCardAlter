// ManaCost.jsx

import React from 'react';
import { manaSymbols } from './ManaSymbols'; // adjust this path to point to your ManaSymbols.js

const ManaCost = ({ manaCost }) => {
    if (!manaCost) return null;
    // Regex to match the curly braces and the content inside them
    const regex = /{([^}]+)}/g;
    let matches;
    let manaIcons = [];

    while ((matches = regex.exec(manaCost)) !== null) {
        console.log("steve", matches[1])
        const iconName = matches[1].replace(/\//g, "").toUpperCase();
        // console.log("steve ", iconName)
        const iconPath = manaSymbols[`${iconName}.jpg`];
        manaIcons.push(
            <img key={matches.index} src={`${iconPath}`} alt={iconName} className="mana-icon"/>
        );
    }

    return (
        <div className="mana-cost">
            {manaIcons}
        </div>
    );
};

export default ManaCost;
