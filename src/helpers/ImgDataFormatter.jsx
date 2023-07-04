import React from "react";
import axios from "axios";

const generateImage = async (textPrompts) => {
  console.log("steve3")
  const response = await axios.post(`http://localhost:5000/api/generate-image`, {
    height: 512, // height of the output image
    width: 768, // width of the output image
    cfg_scale: 1, // replace with the desired cfg_scale
    clip_guidance_preset: 'FAST_BLUE', // replace with the desired clip_guidance_preset
    sampler: 'K_DPM_2_ANCESTRAL', // replace with the desired sampler
    samples: 1, // replace with the desired number of samples
    steps: 75, // replace with the desired number of steps
    style_preset: 'fantasy-art', // replace with the desired style_preset
    text_prompts: textPrompts.map((text, index) => ({
      text,
      weight: index === 0 ? 1.0 : 0.8, // set weight 1.0 for the first prompt, 0.8 for others
    })),
  });
  if (response.status !== 200) {
    throw new Error(`Non-200 response: ${response.statusText}`);
  }

  const { image } = response.data;

  if (!image) {
    throw new Error('No image data found in the image generation response');
  }

  // Return the generated image URL or data
  return image;
};

export default generateImage;
