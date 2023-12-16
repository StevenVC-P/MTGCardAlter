import axios from "../utils/axiosSetup";

const generateImage = async (textPromptsWithWeights, engineValues, card_id, height, width, facetype) => {
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
      card_id,
      height,
      width,
      ...defaultValues,
      ...engineValues,
      text_prompts: textPromptsWithWeights.map(prompt => ({
        text: prompt.text,
        weight: prompt.weight,
      })),
      facetype,
    };

    const response = await axios.post(url, data, config);

    if (response.status === 200) {
      return response.data; // Return the response data to be used by the calling function
    } else {
      throw new Error(`Non-200 response: ${response.statusText}`);
    }
  } catch (error) {
    console.log('Error generating image:', error.message);
    throw error;
  }
};

const generateMultiFaceImage = async (facesData, engineValues, card_id) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const url = 'http://localhost:5000/api/generated-images/generate-multi-face-image'; 

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const defaultValues = {
      samples: 1,
    };

    // Prepare data for each face
    const faces = facesData.map(face => ({
      height: face.height,
      width: face.width,
      ...defaultValues,
      ...engineValues,
      text_prompts: face.prompts.map(prompt => ({
        text: prompt.text,
        weight: prompt.weight,
      })),
    }));

    const data = {
      card_id,
      faces,
    };

    const response = await axios.post(url, data, config);

    if (response.status === 200) {
      return response.data; // Return the response data to be used by the calling function
    } else {
      throw new Error(`Non-200 response: ${response.statusText}`);
    }
  } catch (error) {
    console.log('Error generating image for multi-face card:', error.message);
    throw error;
  }
};

export { generateImage, generateMultiFaceImage };