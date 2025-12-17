import { GoogleGenAI, Type } from "@google/genai";
import { AIListingResponse } from "../types.ts";

export const analyzeImageForListing = async (base64Image: string): Promise<AIListingResponse> => {
  // Initialize GoogleGenAI inside the function right before the API call as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `
    You are an expert appraiser for a C2C marketplace in the UAE (United Arab Emirates). 
    Analyze the provided image of a used item to be sold.
    
    1. Identify the item.
    2. Write a catchy, professional title.
    3. Write a detailed description highlighting potential key features and condition based on visual cues.
    4. Categorize it into one of: Electronics, Furniture, Home Appliances, Fashion, Watches, Toys, Accessories, Others.
    5. Suggest a fair market price in AED (United Arab Emirates Dirham).
    6. Estimate the condition (New, Like New, Good, Fair).
    7. Generate 3-5 relevant search tags.
    
    Ensure the tone is helpful and sales-oriented.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            currency: { type: Type.STRING, enum: ["AED"] },
            condition: { type: Type.STRING, enum: ["New", "Like New", "Good", "Fair"] },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "category", "suggestedPrice", "condition", "tags"],
        },
      },
    });

    // Directly access the .text property from the response object.
    if (response.text) {
      return JSON.parse(response.text) as AIListingResponse;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
