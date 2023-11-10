const colorMap = {
    "W": "#FFFFFF",
    "U": "#1E90FF",
    "B": "#404040",
    "R": "#FF0000",
    "G": "#006400",
    "gold": "#FFD700",
    "colorless": "#C0C0C0",
    "artifact": "#808080"
};

const backgroundColorMap = {
    "W": "#f3f0e7",
    "U": "#c6dce8",
    "B": "#d7cfcc",
    "R": "#f2cfbc",
    "G": "#c2cdc5",
    "gold": "#d3bf84",
    "colorless": "#d8dde1",
    "artifact": "#d8dde1",
    "dual": "#d2cbc1"
};

const extractColorsFromManaCost = (manaCost) => {
    const colors = new Set();
    let manaString;
    
    if (Array.isArray(manaCost)) {
        manaString = manaCost.join(",");
    } else if (typeof manaCost === 'string') {
        manaString = manaCost;
    } else {
        console.error("Invalid type for manaCost");
        return [];
    }

    const pattern = /([WUBRG])/g;
    let match;
    while ((match = pattern.exec(manaString)) !== null) {
        colors.add(match[1]);
    }
    return Array.from(colors);
};

export const getBorderStyle = (colors, manaCost, color_identity) => {
    const boxShadow = "4px 4px 3px rgba(0, 0, 0, 0.5)";
    console.log(manaCost)
    if (!colors || colors.length === 0) {
        if (!color_identity || color_identity.length === 0) {
            console.log(manaCost)
           colors = extractColorsFromManaCost(manaCost);
        } else {
            
            const styleObject = {
                borderColor: colorMap[color_identity[0]],
                borderWidth: '3px',
                borderStyle: 'solid',
                backgroundColor: backgroundColorMap[color_identity[0]],
                boxShadow,
            };

            return styleObject;
        }
    }

    const borderColor = colors.length === 1 ? colorMap[colors[0]] :
        colors.length >= 2 ? colorMap["gold"] : 
        colorMap["artifact"];

    const borderWidth = colors.length === 2 ? '2px' : '3px';

    const backgroundColor = colors.length === 1 ? backgroundColorMap[colors[0]] :
        colors.length >= 2 ? backgroundColorMap["dual"] :
        colors.length > 2 ? backgroundColorMap["gold"] : backgroundColorMap["artifact"];

    return {
        borderColor,
        borderWidth,
        borderStyle: 'solid',
        boxShadow,
        backgroundColor
    };
};
