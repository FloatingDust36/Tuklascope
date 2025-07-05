import axios from 'axios';
import { GEMINI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

const GOOGLE_GENERATIVE_AI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
const GOOGLE_GENERATIVE_AI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const getBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return base64;
  } catch (error) {
    console.error("Failed to convert image to Base64:", error);
    throw error;
  }
};

export const identifyObject = async (imageUri) => {
  try {
    const base64Image = await getBase64(imageUri);
    const requestBody = {
      contents: [{ parts: [{ text: "What is the single, primary object in this image? Respond with only the name of the object." }, { inline_data: { mime_type: "image/jpeg", data: base64Image } }] }]
    };
    const response = await axios.post(GOOGLE_GENERATIVE_AI_API_URL, requestBody);
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error in identifyObject:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const generateLearningCard = async (objectName) => {
  const prompt = `
    You are 'Tuklascope,' an AI science guide for Filipino youth. Your tone is exciting and simple. A user has scanned a/an '${objectName}'.
    Generate three short, engaging learning pathways about it. Contextualize for the Philippines if possible.
    1.  **Biology/Agham-Buhay:** A biological fact.
    2.  **Chemistry/Physics (Kapnayan/Pisika):** A chemical or physical principle.
    3.  **Tech & Pinoy Innovation:** A connection to technology or Filipino innovation.
    Format the output as a valid JSON object only, with no other text, like this: {"biology": {"title": "Agham-Buhay", "text": "..."}, "physics": {"title": "Pisika", "text": "..."}, "tech": {"title": "Tech & Pinoy Innovation", "text": "..."}}
  `;

  try {
    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await axios.post(GOOGLE_GENERATIVE_AI_TEXT_URL, requestBody);
    const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error in generateLearningCard:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getDeeperExplanation = async (conversationHistory) => {
  const prompt = `
    You are 'Tuklascope,' an AI science guide. The user is asking "Why?" about the last fact you provided.
    Here is the conversation so far: ${conversationHistory}.
    Provide a simple, concise explanation that answers the implied "Why?" question.
  `;

  try {
    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await axios.post(GOOGLE_GENERATIVE_AI_TEXT_URL, requestBody);
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error in getDeeperExplanation:", error.response ? error.response.data : error.message);
    return "I'm not sure how to explain that further.";
  }
};