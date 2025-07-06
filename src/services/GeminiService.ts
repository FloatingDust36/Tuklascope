import axios from 'axios';
import { GEMINI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';
import { Discovery } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_GENERATIVE_AI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
type LearningCardData = Discovery['learningData'];

const getBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return base64;
  } catch (error) {
    console.error("Failed to convert image to Base64:", error);
    throw error;
  }
};

export const identifyObject = async (imageUri: string): Promise<{ objectName: string; context: string }> => {
  try {
    const base64Image = await getBase64(imageUri);
    const requestBody = {
      contents: [{ parts: [
        { text: "Analyze the object in this image. Respond with a valid JSON object containing two keys: 'objectName' (the most specific name, e.g., 'Computer Mouse') and 'context' (a single-word category like 'Technology', 'Animal', 'Food', 'Tool')." }, 
        { inline_data: { mime_type: "image/jpeg", data: base64Image } }
      ] }]
    };
    const response = await axios.post(GOOGLE_GENERATIVE_AI_API_URL, requestBody);
    const resultText = response.data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(resultText);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in identifyObject:", error.response?.data?.error || error.message);
    } else {
      console.error("An unexpected error occurred in identifyObject", error);
    }
    return { objectName: "Could not identify object", context: "unknown" };
  }
};

export const generateLearningCard = async (objectName: string, context: string): Promise<LearningCardData | null> => {
  const userLevel = await AsyncStorage.getItem('@userLevel') || 'Batang Kuryoso'; 
  let userLevelInstruction = `\nExplain things in simple English terms for a curious kid, using fun analogies.`;
  if (userLevel === 'High School Explorer') {
    userLevelInstruction = `\nExplain things in clear, informative English using standard high school science terms.`;
  } else if (userLevel === 'College Innovator') {
    userLevelInstruction = `\nExplain things in English using technical terms, mentioning deeper principles.`;
  }

  const final_prompt = `
    You are 'Tuklascope,' an AI science guide. A user has scanned a/an '${objectName}', which you know is in the context of '${context}'.
    Your task is to generate a three-part learning journey in ENGLISH based on the "Observe, Understand, Create" framework. Ensure your facts are relevant to the provided context.
    ${userLevelInstruction}
    // ... (rest of the prompt is the same)
    1.  **Observe:** Generate a "title" and "text" for a mind-blowing, observable fact about the object to spark curiosity.
    2.  **Understand:** Generate a "title" and "text" that explains the core STEM principle behind the "Observe" fact.
    3.  **Create:** Generate a "title" and "text" that explains how humanity has used this principle for technology or innovation, and connects it to a relevant career path in the Philippines.

    You MUST format the output as a single, valid JSON object only, with no other text or markdown. The keys must be "observe", "understand", and "create".
  `;
  
  try {
    const requestBody = { contents: [{ parts: [{ text: final_prompt }] }] };
    const response = await axios.post(GOOGLE_GENERATIVE_AI_API_URL, requestBody);
    const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(rawJson);
    
    return {
        stem: data.observe,
        tech: data.understand,
        local: data.create,
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Error in generateLearningCard:", error.response?.data?.error || error.message);
    } else {
        console.error("An unexpected error occurred in generateLearningCard", error);
    }
    return null;
  }
};

export const getDeeperExplanation = async (conversationHistory: string): Promise<string> => {
    const prompt = `
      You are 'Tuklascope,' an expert science educator who excels at making complex topics simple. The user is asking "Why?" about the last statement in the following conversation.

      CONVERSATION HISTORY:
      ---
      ${conversationHistory}
      ---

      Your task is to provide a deeper explanation. Follow these rules strictly:
      1.  **DO NOT repeat information** already present in the conversation history.
      2.  **Explain the more FUNDAMENTAL principle.** If the topic is Newton's Law, briefly explain what a 'force' is. If the topic is electricity, explain what 'electrons' are. Go one level deeper.
      3.  **Use a simple analogy** to clarify the new, deeper concept..
    `;
  
    try {
      const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await axios.post(GOOGLE_GENERATIVE_AI_API_URL, requestBody);
      return response.data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error in getDeeperExplanation:", error.response?.data?.error || error.message);
        } else {
            console.error("An unexpected error occurred in getDeeperExplanation", error);
        }
      return "I'm not sure how to explain that further at the moment.";
    }
  };

export const getDailyQuest = async (): Promise<string> => {
  const prompt = `You are 'Tuklascope,' an AI guide. Create a single, fun, one-sentence discovery quest in English for a user in Cebu, Philippines. The quest should encourage them to find and scan an everyday object. Make it intriguing. Start with "Today's Quest:".`;
  
  try {
    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await axios.post(GOOGLE_GENERATIVE_AI_API_URL, requestBody);
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error in getDailyQuest:", error);
    return "Today's Quest: Discover something new around you!";
  }
};

export const getCareerInsight = async (discoveryNames: string[]): Promise<string> => {
    if (discoveryNames.length === 0) {
      return "Start scanning objects to discover your potential career paths!";
    }
  
    const prompt = `
      You are 'Tuklascope,' a wise and encouraging career guide for a Filipino student. The user has shown interest in the following items: ${discoveryNames.join(', ')}.
      Your task is to write a short, inspiring, one-paragraph "Personal Insight" for them in English.
      1.  Find a common theme or "meta-skill" that connects at least two of the items (e.g., 'energy systems', 'patterns', 'design', 'vibrations').
      2.  Explain how this interest connects to real-world innovation and a potential career path in the IT-BPM or technology sector in the Philippines.
      3.  End with an uplifting, encouraging sentence about their journey.
      Keep it concise, personal, and inspiring.
    `;
  
    try {
      const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await axios.post(GOOGLE_GENERATIVE_AI_API_URL, requestBody);
      return response.data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error("Error in getCareerInsight:", error);
      return "Explore your discoveries below to see how they connect to amazing careers!";
    }
  };