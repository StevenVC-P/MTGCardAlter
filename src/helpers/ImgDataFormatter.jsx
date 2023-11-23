import axios from "../utils/axiosSetup";

const generateImage = async (textPromptsWithWeights, engineValues, height, width) => {
  try {
    const accessToken  = localStorage.getItem('accessToken');
    const url = 'http://localhost:5000/api/generate-image';

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const defaultValues = {
      samples: 1,
    }

    const data = {
      height,
      width,
      ...defaultValues,
      ...engineValues,
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
