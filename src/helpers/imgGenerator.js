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
  console.log(colorIdentity);
  return colorIdentity
    .map((colorCode) => colorCodeToName[colorCode])
    .join(", ");
}

function getTokenPrompts(all_parts) {
  const tokenParts = all_parts?.filter((part) => part.component === "token") || [];
  return tokenParts.map((part) => `${part.name}, ${part.type_line}`).join(", ");
}

function getThemes(setName, colorNamesEach, keywords) {
  let themes = setThemes[setName] || [];

  const colorsArray = colorNamesEach.split(", ");

  colorsArray.forEach((colorName) => {
    const coreSetThemes = setThemes["Core sets"][colorName];
    if (coreSetThemes) {
      themes.push(...coreSetThemes);
    }
  });

  return themes.concat(keywords).join(", ");
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

function createImagePrompts(texts, sidebarText, sidebarWeight) {
  const defaultWeights = [1.0, 0.3, 0.8, 0.1];
  const filteredTexts = texts.filter(Boolean);
  const defaultPrompts = filteredTexts.map((text, index) => ({
    text,
    weight: defaultWeights[index],
  }));

  if (sidebarText) {
    return [{
      text: sidebarText,
      weight: sidebarWeight,
    }];
  }

  return defaultPrompts;
}
async function generateImageForFace(face, colorNames, themes, sidebarText, sidebarWeight, width, height) {
  const prompts = createImagePrompts([face.name, colorNames, face.type_line, themes], sidebarText, sidebarWeight);
  return await generateImageFromPrompts(prompts, width, height);
}

async function generateImageFromPrompts(prompts, width, height) {
  return await generateImage(combinePromptsByWeight(prompts), width, height);
}

export default async function generateImageForCard(cardData, sidebarText, sidebarWeight, counter) {
  const { name, color_identity, type_line, layout, card_faces, keywords, all_parts, set_name } = cardData.data;

  const colorNamesEach = getColorNames(color_identity);
  const tokenPrompts = getTokenPrompts(all_parts);
  const themes = getThemes(set_name, colorNamesEach, keywords);
  sidebarWeight /= 10;

  if (keywords.includes("Aftermath") || (layout === "split" && card_faces)) {
    if (counter < 2) {
      console.warn("Counter less than 2, not generating image for multiple-faced card.");
      return { error: "Counter insufficient for multi-faced cards." };
    }
    const [firstImage, secondImage] = await Promise.all(card_faces.map((face, index) => generateImageForFace(face, colorNamesEach, themes, sidebarText, sidebarWeight, index === 0 ? 576 : 512, index === 0 ? 1600 : 832)));
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
          width = 1600;
        } else if (face.type_line.includes("Battle")) {
          height = 1280;
        }

        return generateImageForFace(face, colorNamesEach, themes, sidebarText, sidebarWeight, width, height);
      })
    );
    return { firstImage: images[0], secondImage: images[1] };
  } else {
    const width = layout === "saga" ? 1600 : 512;
    const height = layout === "saga" ? 576 : 640;
    const texts = layout === "adventure" && card_faces ? [card_faces[0].name, card_faces[1].name, colorNamesEach, card_faces[0].type_line, themes] : [name, colorNamesEach, type_line, themes];

    const image = await generateImageFromPrompts(createImagePrompts(texts, sidebarText, sidebarWeight), width, height);
    return { image };
  }
}
