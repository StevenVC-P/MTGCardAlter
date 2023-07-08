// helpers/imageGenerator.js

import generateImage from "./ImgDataFormatter";

export default function generateImageForCard(cardData) {
  const { name, color_identity, type_line } = cardData.data;
  const colorCodeToName = {
    W: "White",
    R: "Red",
    G: "Green",
    B: "Black",
    U: "Blue",
  };

  const colorNames = color_identity.map((colorCode) => colorCodeToName[colorCode]);

  return generateImage([name, ...colorNames, type_line]);
}
