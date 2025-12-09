import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real production app, you should never expose API keys on the client side.
// This is for demonstration purposes or internal tools where the environment is controlled.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePostCaption = async (topic: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, engaging social media post caption about: ${topic}. 
    Include 2-3 relevant hashtags. Keep it under 280 characters. 
    Tone: Casual and friendly.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate caption.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const enhanceBio = async (currentBio: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Rewrite the following social media bio to be more professional yet approachable. 
    Keep it concise (under 150 characters).
    Current Bio: "${currentBio}"`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || currentBio;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return currentBio;
  }
};
