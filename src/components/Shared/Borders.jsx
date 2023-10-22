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
    "artifact": "#d8dde1"
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
    console.log(colors)
    if (!colors || colors.length === 0) {
        if (!color_identity || color_identity.length === 0) {
            colors = extractColorsFromManaCost(manaCost);
        } else {
            const styleObject = {
                borderColor: colorMap[color_identity[0]],
                borderWidth: '3px',
                borderStyle: 'solid',
                backgroundColor: backgroundColorMap[color_identity[0]],
                boxShadow,
            };

            console.log(styleObject);

            return styleObject;
        }
    }

    const borderColor = colors.length === 1 ? colorMap[colors[0]] :
        colors.length === 2 ? colorMap["black"] :
        colors.length > 2 ? colorMap["gold"] : colorMap["artifact"];

    const borderWidth = colors.length === 2 ? '2px' : '3px';

    const backgroundColor = colors.length === 1 ? backgroundColorMap[colors[0]] :
        colors.length === 2 ? backgroundColorMap["black"] :
        colors.length > 2 ? backgroundColorMap["gold"] : backgroundColorMap["artifact"];

    return {
        borderColor,
        borderWidth,
        borderStyle: 'solid',
        boxShadow,
        backgroundColor
    };
};
