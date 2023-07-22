// helpers/imageGenerator.js

import generateImage from "./ImgDataFormatter";

export default async function generateImageForCard(cardData) {
    const { name, color_identity, type_line, layout, card_faces, keywords } = cardData.data;
    const colorCodeToName = {
    W: "White",
    R: "Red",
    G: "Green",
    B: "Black",
    U: "Blue",
    };

    const colorNames = color_identity.map((colorCode) => colorCodeToName[colorCode]);
    //if the layout is split, generate two images.
    if (keywords.includes("Aftermath")) {
        const firstImage = await generateImage([card_faces[0].name, ...colorNames, card_faces[0].type_line], 576, 1600);
        const secondImage = await generateImage([card_faces[1].name, ...colorNames, card_faces[1].type_line], 512, 832);
        return { firstImage, secondImage };
    }
      if (layout === "split" && card_faces) {
        // generate images for each face
        const firstImage = await generateImage([card_faces[0].name, ...colorNames, card_faces[0].type_line], 512, 640);
        const secondImage = await generateImage([card_faces[1].name, ...colorNames, card_faces[1].type_line], 512, 640);
        // return an object containing both images
        return { firstImage, secondImage };
      } else if (layout === "transform" && card_faces) {
        const images = [];
        for (let face of card_faces) {
          let image;
          if (face.type_line.includes("Saga")) {
            image = await generateImage([face.name, ...colorNames, face.type_line], 1600, 576);
          } else if (face.type_line.includes("Battle")) {
            image = await generateImage([face.name, ...colorNames, face.type_line], 512, 1280);
          } else {
            image = await generateImage([face.name, ...colorNames, face.type_line], 512, 640);
          }
          images.push(image);
        }
        return { firstImage: images[0], secondImage: images[1] };
      } else if (layout === "saga") {
        const image = await generateImage([name, ...colorNames, type_line], 1600, 576);
        return { image };
      } else if (layout === "adventure" && card_faces) {
        const image = await generateImage([card_faces[0].name, ...colorNames, card_faces[0].type_line], 512, 640);
        return { image };
      }

  // if card is not split, generate single image as before
  const image = await generateImage([name, ...colorNames, type_line], 512, 640);
  return { image };
}

