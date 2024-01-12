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

export const getBorderStyle = (colors, manaCost, color_identity, layout) => {
    const boxShadow = "4px 4px 3px rgba(0, 0, 0, 0.5)";

    if (!colors || colors.length === 0) {
        if (color_identity && color_identity.length > 0) {
            colors = extractColorsFromManaCost(color_identity);
        } else if (manaCost) {
            colors = extractColorsFromManaCost(manaCost);
        }
    }

    let borderColor = ''
    let backgroundColor = ''

    if (layout !== undefined) {

        borderColor = layout.includes("planar ") ? colorMap['gold']
            : colors.length === 1 ? colorMap[colors[0]] 
            : colors.length >= 2 ? colorMap["gold"]
            : colorMap["artifact"];

        backgroundColor = layout.includes("planar ") ? backgroundColorMap['gold'] : colors.length === 1 ? backgroundColorMap[colors[0]] :
            colors.length >= 2 ? backgroundColorMap["dual"] :
            colors.length > 2 ? backgroundColorMap["gold"] : backgroundColorMap["artifact"];

    } else  {

        borderColor = colors.length === 1 ? colorMap[colors[0]] 
            : colors.length >= 2 ? colorMap["gold"]
            : colorMap["artifact"];

        backgroundColor = colors.length === 1 ? backgroundColorMap[colors[0]] :
            colors.length >= 2 ? backgroundColorMap["dual"] :
            colors.length > 2 ? backgroundColorMap["gold"] : backgroundColorMap["artifact"];

    }


    const borderWidth = colors.length === 2 ? '2px' : '3px';

    

    return {
        borderColor,
        borderWidth,
        borderStyle: 'solid',
        boxShadow,
        backgroundColor
    };
};
