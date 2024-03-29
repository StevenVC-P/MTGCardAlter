// helpers/imageGenerator.js

import { generateImage, generateMultiFaceImage } from "./ImgDataFormatter";
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

async function generateImageForFace(face, colorNames, keywords, tokenPrompts, otherValues, sidebarText, sidebarWeight, engineValues, card_id, width, height, faceType, quantity) {
  const normalizedValues = {
    cardName: face.name,
    color: colorNames,
    typeLine: face.type_line,
    keywords: keywords,
    tokens: tokenPrompts,
  };
  console.log("normalizedValues: ", normalizedValues);
  const prompts = createImagePrompts(normalizedValues, otherValues, sidebarText, sidebarWeight);
  const result = await generateImageFromPrompts(prompts, engineValues, card_id, width, height, faceType, quantity);
  return result;
}

async function generateImageFromPrompts(prompts, engineValues, card_id, width, height, faceType, quantity) {
  return await generateImage(combinePromptsByWeight(prompts), engineValues, card_id, height, width, faceType, quantity);
}

export default async function generateImageForCard(cardData, sidebarText, sidebarWeight, otherValues, engineValues, counter, quantity) {
  const { card_id, name, color_identity, type_line, layout, card_faces, keywords, relatedCards, flavor } = cardData.data;

  const colorNamesEach = getColorNames(color_identity);
  const tokenPrompts = getTokenPrompts(relatedCards);

  const dualLayouts = ["transform", "modal_dfc", "art_series", "reversible_card", "double_faced_token"];
  if (keywords.includes("Aftermath") || (layout === "split" && card_faces)) {
    if (counter < 2) {
      console.warn("Counter less than 2, not generating image for multiple-faced card.");
      return { error: "Counter insufficient for multi-faced cards." };
    }
    const colorNames = getColorNamesFromFaces(card_faces);
    // Prepare data for each face
    const facesData = card_faces.map((face, index) => {
      let width, height;

      if (keywords.includes("Aftermath")) {
        width = index === 0 ? 896 : 512;
        height = index === 0 ? 320 : 320;
      } else {
        width = 640;
        height = 512;
      }

      const colorName = colorNames[index];
      const normalizedValues = {
        cardName: face.name,
        color: colorName,
        typeLine: face.type_line,
        keywords: keywords,
        tokens: tokenPrompts,
      };
      const prompts = createImagePrompts(normalizedValues, otherValues, sidebarText, sidebarWeight);

      return {
        height,
        width,
        prompts: prompts.map((prompt) => ({
          text: prompt.text,
          weight: prompt.weight,
        })),
      };
    });

    try {
      const success = await generateMultiFaceImage(facesData, engineValues, card_id, quantity);
      return [success];
    } catch (error) {
      console.error("Error generating image for multi-face card:", error.message);
      throw error;
    }
  } else if (dualLayouts.includes(layout) && card_faces) {
    if (counter < 2) {
      console.warn("Counter less than 2, not generating image for multiple-faced card.");
      return { error: "Counter insufficient for multi-faced cards." };
    }
    
    const cardResults = await Promise.all(
      card_faces.map((face, index) => {
        let height = 512;
        let width = 640;

        if (face.type_line.includes("Saga")) {
          height = 1536;
          width = 576;
        } else if (face.type_line.includes("Battle")) {
          width = 1280;
        }

        const faceType = index === 0 ? "front" : "back";
        console.log("inside face: ", face);
        return generateImageForFace(face, colorNamesEach, keywords, tokenPrompts, otherValues, sidebarText, sidebarWeight, engineValues, card_id, width, height, faceType, quantity);
      })
    );

    return cardResults;
  } else {
    let width, height;
    if (layout.includes("planar")) {
      height = 448;
      width = 1408;
    } else {
      width = layout === "saga" ? 576 : 704;
      height = layout === "saga" ? 1536 : 512;
    }
    console.log("layout: ", layout, " width: ", width, " height: ", height);
    let normalizedValues = {};
    if (layout === "adventure" && card_faces) {
      normalizedValues = {
        cardName: [card_faces[0].name, card_faces[1].name],
        color: colorNamesEach,
        typeLine: card_faces[0].type_line,
        keywords: keywords,
        tokens: tokenPrompts,
      };
    } else
      normalizedValues = {
        cardName: name,
        color: colorNamesEach,
        typeLine: type_line,
        keywords: keywords,
        tokens: tokenPrompts,
      };
    const imageResult = await generateImageFromPrompts(createImagePrompts(normalizedValues, otherValues, sidebarText, sidebarWeight), engineValues, card_id, width, height, null, quantity);
    return [imageResult];
  }
}
