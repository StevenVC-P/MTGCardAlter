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
    const colors = new Set();
    const manaString = manaCost.join(",");
    const pattern = /([WUBRG])/g;
    let match;
    while ((match = pattern.exec(manaString)) !== null) {
        colors.add(match[1]);
    }
    return Array.from(colors);
};

export const getBorderStyle = (colors, manaCost, color_identity) => {
    const boxShadow = "4px 4px 3px rgba(0, 0, 0, 0.5)";

    if (!colors || colors.length === 0) {
        if (!color_identity || color_identity.length === 0) {
            colors = extractColorsFromManaCost(manaCost);
        } else {
            return {
                borderColor: colorMap[color_identity[0]],
                borderWidth: '3px',
                borderStyle: 'solid',
                boxShadow,
            };
        }
    }

    const borderColor = colors.length === 1 ? colorMap[colors[0]] :
        colors.length === 2 ? colorMap["black"] :
        colors.length > 2 ? colorMap["gold"] : colorMap["artifact"];

    const borderWidth = colors.length === 2 ? '2px' : '3px';

    return {
        borderColor,
        borderWidth,
        borderStyle: 'solid',
        boxShadow,
    };
};
