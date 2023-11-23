// helpers/imageGenerator.js

import generateImage from "./ImgDataFormatter";
import setThemes from "../assets/Misc/mtg_set_themes.json";

const colorCodeToName = {
  W: "White",
  R: "Red",
  G: "Green",
  B: "Black",
  U: "Blue",
};

function getColorNames(colorIdentity) {
  return colorIdentity
    .map((colorCode) => colorCodeToName[colorCode])
    .join(", ");
}

function getColorNamesFromFaces(card_faces) {
  return card_faces.map((face) => {
    const colorSet = new Set();
    const manaCost = face.mana_cost || "";
    for (let code in colorCodeToName) {
      if (manaCost.includes(`{${code}}`)) {
        colorSet.add(colorCodeToName[code]);
      }
    }
    return Array.from(colorSet);
  });
}


function getTokenPrompts(all_parts) {
  const tokenParts = all_parts?.filter((part) => part.component === "token") || [];
  return tokenParts.map((part) => `${part.name}`);
}

// function getThemes(setName, colorNamesEach, keywords) {
//   let themes = setThemes[setName] || [];

//   const colorsArray = colorNamesEach.split(", ");

//   colorsArray.forEach((colorName) => {
//     const coreSetThemes = setThemes["Core sets"][colorName];
//     if (coreSetThemes) {
//       themes.push(...coreSetThemes);
//     }
//   });

//   return themes.concat(keywords).join(", ");
// }

function combinePromptsByWeight(prompts) {
  const groupedPrompts = new Map();

  prompts.forEach((prompt) => {
    const { weight, text } = prompt;
    const existingPrompt = groupedPrompts.get(weight);

    if (existingPrompt) existingPrompt.text += `, ${text}`;
    else groupedPrompts.set(weight, { text, weight });
  });

  return Array.from(groupedPrompts.values());
}

function createImagePrompts(normalizedValues, otherValues, sidebarText, sidebarWeight) {
  const defaultPrompts = Object.entries(normalizedValues)
    .map(([key, value]) => {
      // Check for emptiness based on the type of `value`
      const isEmpty = value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && value.trim() === "");

      if (isEmpty || otherValues[key] === 0) {
        return null;
      }

      // If the value is an array, convert it to a comma-separated string
      const textValue = Array.isArray(value) ? value.join(", ") : value;
      const weight = otherValues[key] / 10;
      return {
        text: textValue,
        weight: weight,
      };
    })
    .filter(Boolean);

  if (sidebarText && sidebarWeight !== 0) {
    // Divide the sidebarWeight by 10
    const normalizedSidebarWeight = sidebarWeight / 10;

    defaultPrompts.push({
      text: sidebarText,
      weight: normalizedSidebarWeight,
    });
  }
  return defaultPrompts;
}

async function generateImageForFace(face, colorNames, keywords, tokenPrompts, otherValues, sidebarText, sidebarWeight, engineValues, width, height) {
  const normalizedValues = {
    cardName: face.name,
    color: colorNames,
    typeLine: face.type_line,
    keywords: keywords,
    tokens: tokenPrompts,
  };
  const prompts = createImagePrompts(normalizedValues, otherValues, sidebarText, sidebarWeight);
  return await generateImageFromPrompts(prompts, engineValues, width, height);
}

async function generateImageFromPrompts(prompts, engineValues, width, height) {
  return await generateImage(combinePromptsByWeight(prompts), engineValues, width, height);
}

export default async function generateImageForCard(cardData, sidebarText, sidebarWeight, otherValues, engineValues, counter) {
  const { name, color_identity, type_line, layout, card_faces, keywords, relatedCards, flavor } = cardData.data;

  const colorNamesEach = getColorNames(color_identity);
  const tokenPrompts = getTokenPrompts(relatedCards);

  if (keywords.includes("Aftermath") || (layout === "split" && card_faces)) {
    if (counter < 2) {
      console.warn("Counter less than 2, not generating image for multiple-faced card.");
      return { error: "Counter insufficient for multi-faced cards." };
    }
    const colorNames = getColorNamesFromFaces(card_faces);
    const [firstImage, secondImage] = await Promise.all(
      card_faces.map((face, index) => {
        let width, height;

        if (keywords.includes("Aftermath")) {
          // Dimensions from your old "Aftermath" code
          width = index === 0 ? 576 : 512;
          height = index === 0 ? 1536 : 832;
        } else {
          // Dimensions from your old "split" code
          width = 512;
          height = 640;
        }
        return generateImageForFace(face, colorNames[index], keywords, tokenPrompts, otherValues, sidebarText, sidebarWeight, engineValues, width, height);
      })
    );

    return { firstImage, secondImage };
  } else if (layout === "transform" && card_faces) {
    if (counter < 2) {
      console.warn("Counter less than 2, not generating image for multiple-faced card.");
      return { error: "Counter insufficient for multi-faced cards." };
    }
    const images = await Promise.all(
      card_faces.map((face) => {
        let width = 512;
        let height = 640;

        if (face.type_line.includes("Saga")) {
          height = 576;
          width = 1536;
        } else if (face.type_line.includes("Battle")) {
          height = 1280;
        }

        return generateImageForFace(face, colorNamesEach, keywords, tokenPrompts, otherValues, sidebarText, sidebarWeight, engineValues,width, height);
      })
    );
    return { firstImage: images[0], secondImage: images[1] };
  } else {
    const width = layout === "saga" ? 1536 : 512;
    const height = layout === "saga" ? 576 : 640;

    let normalizedValues= {}
    if ( layout === "adventure" && card_faces) {
        normalizedValues = {
          cardName: [card_faces[0].name, card_faces[1].name],
          color: colorNamesEach,
          typeLine: card_faces[0].type_line,
          keywords: keywords,
          tokens: tokenPrompts,
        };
    } else (
        normalizedValues = {
        cardName: name,
        color: colorNamesEach,
        typeLine: type_line,
        keywords: keywords,
        tokens: tokenPrompts,
      }
    )
    const image = await generateImageFromPrompts(createImagePrompts(normalizedValues, otherValues, sidebarText, sidebarWeight), engineValues, width, height);
    return { image };
  }
}
