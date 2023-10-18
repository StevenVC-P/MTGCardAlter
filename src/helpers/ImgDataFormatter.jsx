import axios from "../utils/axiosSetup";

const generateImage = async (textPromptsWithWeights, height, width) => {
  try {
    const authToken = localStorage.getItem('accessToken');
    const url = 'http://localhost:5000/api/generate-image';

    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    const data = {
      height,
      width,
      cfg_scale: 25,
      clip_guidance_preset: 'NONE',
      samples: 1,
      steps: 75,
      style_preset: 'digital-art',
      text_prompts: textPromptsWithWeights.map(prompt => ({
        text: prompt.text,
        weight: prompt.weight,
      })),
    };

    const response = await axios.post(url, data, config);

    if (response.status !== 200) {
      throw new Error(`Non-200 response: ${response.statusText}`);
    }

    const { image } = response.data;

    if (!image) {
      throw new Error('No image data found in the image generation response');
    }

    return image;
  } catch (error) {
    console.log('Error generating image:', error.message);
    throw error;
  }
};

export default generateImage;
