// helpers/imageGenerator.js

import generateImage from "./ImgDataFormatter";
import setThemes from "../assets/Misc/mtg_set_themes.json";

export default async function generateImageForCard(cardData, sidebarText, sidebarWeight) {
  const { name, color_identity, type_line, layout, card_faces, keywords, all_parts, set_name, flavor_text } = cardData.data;
  const colorCodeToName = {
    W: "White",
    R: "Red",
    G: "Green",
    B: "Black",
    U: "Blue",
  };



  const colorNamesEach = color_identity.map((colorCode) => colorCodeToName[colorCode]);
  const colorNames = colorNamesEach.join(", ");
  // Get the token parts and combine them into a single string
  const tokenParts = all_parts?.filter((part) => part.component === "token") || [];
  const tokenTexts = tokenParts.map((part) => `${part.name}, ${part.type_line}`);
  const tokenPrompts = tokenTexts.join(", ");

  function getThemes(setName, colorNames) {
    // Attempt to retrieve themes based on set name
    let themes = setThemes[setName];

    // If not found, default to themes from core sets that match the card's color
    if (!themes) {
      themes = []; // Initialize as an empty array
      colorNamesEach.forEach((color) => {
        const coreSetThemes = setThemes["Core sets"][color];
        if (coreSetThemes) {
          themes.push(...coreSetThemes);
        }
      });
    }

    themes.push(...keywords);

    return themes.join(", ");
  }

  const themes = getThemes(set_name, colorNames);

  function combinePromptsByWeight(prompts) {
    // Using a JavaScript Map to group prompts by weight
    const groupedPrompts = new Map();

    prompts.forEach((prompt) => {
      const existingPrompt = groupedPrompts.get(prompt.weight);
      if (existingPrompt) {
        // If there's an existing prompt with the same weight, append the text
        existingPrompt.text += `, ${prompt.text}`;
      } else {
        // Otherwise, add the prompt to the map
        groupedPrompts.set(prompt.weight, { text: prompt.text, weight: prompt.weight });
      }
    });

    // Convert the map values into an array and return
    return Array.from(groupedPrompts.values());
  }

  sidebarWeight /= 10;

  //if the layout is split, generate two images.
  if (keywords.includes("Aftermath")) {
    const firstImagePrompts = [
      { text: card_faces[0].name, weight: 1.0 },
      { text: colorNames, weight: 0.8 },
      { text: card_faces[0].type_line, weight: 0.8 },
      { text: tokenPrompts, weight: 0.8 },
      { text: themes, weight: 0.5 },
      { text: sidebarText, weight: sidebarWeight},
    ];

    const firstCombinedPrompts = combinePromptsByWeight(firstImagePrompts);
    const firstImage = await generateImage(firstCombinedPrompts, 576, 1600);

    const secondImagePrompts = [
      { text: card_faces[1].name, weight: 1.0 },
      { text: colorNames, weight: 0.8 },
      { text: card_faces[1].type_line, weight: 0.8 },
      { text: tokenPrompts, weight: 0.8 },
      { text: themes, weight: 0.5 },
      { text: sidebarText, weight: sidebarWeight },
    ];
    const secondCombinedPrompts = combinePromptsByWeight(secondImagePrompts);
    const secondImage = await generateImage(secondCombinedPrompts, 512, 832);

    return { firstImage, secondImage };
  }
  if (layout === "split" && card_faces) {
    // generate images for each face
    const firstImagePrompts = [
      { text: card_faces[0].name, weight: 1.0 },
      { text: colorNames, weight: 0.8 },
      { text: card_faces[0].type_line, weight: 0.8 },
      { text: tokenPrompts, weight: 0.8 },
      { text: themes, weight: 0.5 },
      { text: sidebarText, weight: sidebarWeight },
    ];
    const firstCombinedPrompts = combinePromptsByWeight(firstImagePrompts);
    const firstImage = await generateImage(firstCombinedPrompts, 512, 640);

    const secondImagePrompts = [
      { text: card_faces[1].name, weight: 1.0 },
      { text: colorNames, weight: 0.8 },
      { text: card_faces[1].type_line, weight: 0.8 },
      { text: tokenPrompts, weight: 0.8 },
      { text: themes, weight: 0.5 },
      { text: sidebarText, weight: sidebarWeight },
    ];
    const secondCombinedPrompts = combinePromptsByWeight(secondImagePrompts);
    const secondImage = await generateImage(secondCombinedPrompts, 512, 640);
    // return an object containing both images
    return { firstImage, secondImage };
  } else if (layout === "transform" && card_faces) {
    const images = [];
    for (let face of card_faces) {
      let image;
      if (face.type_line.includes("Saga")) {
        const imagePrompts = [
          { text: name, weight: 1.0 },
          { text: colorNames, weight: 0.8 },
          { text: type_line, weight: 0.8 },
          { text: tokenPrompts, weight: 0.8 },
          { text: themes, weight: 0.5 },
          { text: sidebarText, weight: sidebarWeight },
        ];

        const combinedPrompts = combinePromptsByWeight(imagePrompts);
        image = await generateImage(combinedPrompts, 1600, 576);
      } else if (face.type_line.includes("Battle")) {
        const imagePrompts = [
          { text: name, weight: 1.0 },
          { text: colorNames, weight: 0.8 },
          { text: type_line, weight: 0.8 },
          { text: tokenPrompts, weight: 0.8 },
          { text: themes, weight: 0.5 },
          { text: sidebarText, weight: sidebarWeight },
        ];

        const combinedPrompts = combinePromptsByWeight(imagePrompts);
        image = await generateImage(combinedPrompts, 512, 1280);
      } else {
        const imagePrompts = [
          { text: name, weight: 1.0 },
          { text: colorNames, weight: 0.8 },
          { text: type_line, weight: 0.8 },
          { text: tokenPrompts, weight: 0.8 },
          { text: themes, weight: 0.5 },
          // { text: flavor_text, weight: 0.5 },
          { text: sidebarText, weight: sidebarWeight },
        ];

        const combinedPrompts = combinePromptsByWeight(imagePrompts);
        image = await generateImage(combinedPrompts, 512, 640);
      }
      images.push(image);
    }
    return { firstImage: images[0], secondImage: images[1] };
  } else if (layout === "saga") {
    const imagePrompts = [
      // { text: name, weight: 1.0 },
      // { text: colorNames, weight: 0.8 },
      // { text: type_line, weight: 0.8 },
      // { text: tokenPrompts, weight: 0.8 },
      // { text: themes, weight: 0.5 },
      // { text: flavor_text, weight: 0.5 },
      { text: sidebarText, weight: sidebarWeight },
    ];

    const combinedPrompts = combinePromptsByWeight(imagePrompts);
    const image = await generateImage(combinedPrompts, 1600, 576);
    return { image };
  } else if (layout === "adventure" && card_faces) {
    const imagePrompts = [
      { text: card_faces[0].name, weight: 1.0 },
      { text: card_faces[1].name, weight: 1.0 },
      { text: colorNames, weight: 0.3 },
      { text: card_faces[0].type_line, weight: 0.8 },
      // { text: tokenPrompts, weight: 0.4 },
      { text: themes, weight: 0.1 },
      // { text: flavor_text, weight: 0.2 },
      // { text: sidebarText, weight: sidebarWeight },
    ];

    const combinedPrompts = combinePromptsByWeight(imagePrompts);
    const image = await generateImage(combinedPrompts, 512, 640);
    return { image };
  } else {
    // if card is not split, generate single image as before
    const imagePrompts = [
      { text: name, weight: 1.0 },
      { text: colorNames, weight: 0.3 },
      { text: type_line, weight: 0.8 },
      // { text: tokenPrompts, weight: 0.4 },
      { text: themes, weight: 0.1 },
      // { text: flavor_text, weight: 0.2 },
      // { text: sidebarText, weight: sidebarWeight },
    ];

    const combinedPrompts = combinePromptsByWeight(imagePrompts);
    const image = await generateImage(combinedPrompts, 512, 640);
    return { image };
  }
}

