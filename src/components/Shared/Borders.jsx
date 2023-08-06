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

const extractColorsFromManaCost = (manaCost) => {
    const colors = [];
    const pattern = /\{([WUBRG])\}/g;
    let match;
    while (match = pattern.exec(manaCost)) {
        colors.push(match[1]);
    }
    return [...new Set(colors)];
};

export const getBorderStyle = (colors, manaCost) => {
    const boxShadow = "3px 3px 2px rgba(0, 0, 0, 0.5)"; // adjust as necessary

    if (!colors || colors.length === 0) {
        colors = extractColorsFromManaCost(manaCost);
    }

    if (colors.length === 1) {
        return {
            borderColor: colorMap[colors[0]],
            borderWidth: '3px',
            borderStyle: 'solid',
            boxShadow: boxShadow,
        };
    } else if (colors.length === 2) {
        return {
            borderImage: `linear-gradient(90deg, ${colorMap[colors[0]]} 20%, ${colorMap[colors[1]]} 80%) 1`, // adjusted values for melding
            borderWidth: '3px',
            borderStyle: 'solid',
            boxShadow: boxShadow,
        };
    } else if (colors.length > 2) {
        return {
            borderColor: colorMap["gold"],
            borderWidth: '3px',
            borderStyle: 'solid',
            boxShadow: boxShadow,
        };
    }
    else {
        return {
            borderColor: colorMap["artifact"],
                borderWidth: '3px',
                borderStyle: 'solid',
                boxShadow: boxShadow,
        }
    }
};