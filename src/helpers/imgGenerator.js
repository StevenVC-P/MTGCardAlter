// helpers/imageGenerator.js

import generateImage from "./ImgDataFormatter";

export default async function generateImageForCard(cardData) {
    const { name, color_identity, type_line, layout, card_faces } = cardData.data;
    const colorCodeToName = {
    W: "White",
    R: "Red",
    G: "Green",
    B: "Black",
    U: "Blue",
    };

    const colorNames = color_identity.map((colorCode) => colorCodeToName[colorCode]);
    //if the layout is split, generate two images.
    if (layout === "split" && card_faces) {
        // generate images for each face
        const firstImage = await generateImage([card_faces[0].name, ...colorNames, card_faces[0].type_line]);
        const secondImage = await generateImage([card_faces[1].name, ...colorNames, card_faces[1].type_line]);
        
        // return an object containing both images
        return { firstImage, secondImage };
    } else if (layout === "adventure" && card_faces) {
        const image = await generateImage([card_faces[0].name, ...colorNames, card_faces[0].type_line]);
        return { image };
    }

  // if card is not split, generate single image as before
  const image = await generateImage([name, ...colorNames, type_line]);
  return { image };
}
