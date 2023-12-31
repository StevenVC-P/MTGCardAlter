import React, { useMemo } from 'react';
import { importAll } from '../Utils/utils';

// Get all images from the backgrounds directory
export const backgroundsSolid = importAll(require.context('../../assets/Backgrounds/solid', false, /\.(png|jpe?g|svg)$/));
export const backgroundsHybrid = importAll(require.context('../../assets/Backgrounds/hybrid', false, /\.(png|jpe?g|svg)$/));

// Map color initials to full color names
const colorMap = {
    'W': 'White',
    'U': 'Blue',
    'B': 'Black',
    'R': 'Red',
    'G': 'Green'
};

const CardBackground = ({ children, type_line, colors, mana_cost, className, color_identity }) => {
    const backgroundImage = useMemo(() => {
        if (type_line.includes('Land')) {
            return backgroundsSolid['Land.jpg'];
        }
        else if (type_line.includes('Artifact')) {
            return backgroundsSolid['Artifact.jpg'];
        }
        else if (type_line.includes("Plane ") || type_line.includes('Phenomenon')) {
            return backgroundsSolid['Gold.jpg'];
        }
        else {
            const costElements = mana_cost ? mana_cost.match(/{[^}]+}/g) : [];
            let manaColors = new Set();
            let hybridColors = [];
            
            costElements.forEach((cost) => {
                cost = cost.slice(1, -1); // remove the enclosing braces
                if (isNaN(cost)) { // if cost is not a number
                    if (cost.includes("/") && !cost.includes("P")) { // if cost is a hybrid mana (and not Phyrexian)
                        
                        const colorPair = cost.split("/");
                        if (colorPair.includes("2")) { // special case: hybrid mana that can be paid with 2 colorless mana or one colored mana
                            colorPair.splice(colorPair.indexOf("2"), 1); // remove "2" from array

                            colorPair.forEach(color => manaColors.add(color));
                            if (!hybridColors.includes(colorPair.join(""))) {
                                hybridColors.push(colorPair.join(""));
                            }
                        } else {
                            colorPair.forEach(color => manaColors.add(color));
                            if (!hybridColors.includes(colorPair.join(""))) {
                                hybridColors.push(colorPair.join(""));
                            }
                        }
                    } else { 
                        if (!manaColors.has(cost)) {
                            manaColors.add(cost.replace('P', '')); 
                            manaColors.delete('X');
                        }
                    }
                }
            });
            
            // Fallback to the 'colors' prop if 'mana_cost' is not available
            if (manaColors.size === 0 && colors && colors.length > 0) {
                colors.forEach(color => manaColors.add(color));
            }

            if (manaColors.size === 0 && color_identity && color_identity.length > 0) {
                color_identity.forEach(color => manaColors.add(color));
            }

            if (Array.from(manaColors).sort().join("") !== Array.from(hybridColors).sort().join("") && hybridColors.length !== 0 ) {

                return backgroundsSolid['Gold.jpg'];
            } 
            else if (hybridColors.length === 1 && manaColors.size !== 1) {
                const colorPair = hybridColors[0].charAt(0) + hybridColors[0].charAt(1);
                return backgroundsHybrid[`${colorPair}.jpg`];
            } 
            else if (hybridColors.length > 1 || manaColors.size > 1) {
                return backgroundsSolid['Gold.jpg'];
            }
            else {
                const color = colorMap[Array.from(manaColors)[0]];
                return backgroundsSolid[`${color}.jpg`];
            }
        }
    }, [type_line, colors, mana_cost, color_identity]);
    const isSplitCard = className?.toLowerCase().includes("split") ?? false;

    const backgroundClass = isSplitCard ? 'split-card-background' : `card-background ${className || ''}`;
    
    return (
    <div className={backgroundClass} style={{ backgroundImage: `url(${backgroundImage})`, zIndex: 0}}>
      {children}
    </div>
    );
}

export default CardBackground;