import { GoogleGenAI, Chat } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

let chatSession: Chat | null = null;

const getSystemInstruction = () => {
  const productContext = MOCK_PRODUCTS.map(p => 
    `- ${p.name} ($${p.price}): ${p.description}`
  ).join('\n');

  return `You are a helpful and enthusiastic shopping assistant for CodeAlpha Store, a tech e-commerce shop.
  
  Here is our current product inventory:
  ${productContext}
  
  Your goal is to help customers find products, answer questions about specifications, and suggest items based on their needs.
  - Be concise and friendly.
  - If a user asks about a product we don't have, politely suggest a similar alternative from our inventory if possible, or state we don't carry it.
  - Do not invent products that are not in the list.
  - You can use emojis to be expressive.
  `;
};

export const initializeChat = (): Chat => {
  // NOTE: accessing process.env.API_KEY directly as per instructions
  const apiKey = process.env.API_KEY || '';
  
  // Fallback for demo purposes if no key is present, to prevent crash, though functionality will fail.
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: getSystemInstruction(),
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "I'm having trouble connecting to the brain right now. Please check your API key.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I'm not sure how to answer that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error processing your request. Please try again later.";
  }
};