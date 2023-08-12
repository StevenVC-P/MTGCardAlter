import axios from "axios";

const generateImage = async (textPromptsWithWeights, height, width) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/generate-image`, {
      height: height, // height of the output image
      width: width, // width of the output image
      cfg_scale: 25, // replace with the desired cfg_scale
      clip_guidance_preset: 'NONE', // replace with the desired clip_guidance_preset
      samples: 1, // replace with the desired number of samples
      steps: 75, // replace with the desired number of steps
      style_preset: 'digital-art', // replace with the desired style_preset
      text_prompts: textPromptsWithWeights.map(prompt => ({
        text: prompt.text,
        weight: prompt.weight,
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
  } catch (error) {
    console.log('Error generating image:', error.message);
    throw error; // You may also choose to reformat the error before throwing it, if necessary
  }
};

export default generateImage;
