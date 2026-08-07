import { ai, AI_MODEL } from "./aiClient.js";

/**
 * Generate AI response using Gemini
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
export async function generateAIResponse(systemPrompt, userMessage) {
  try {
    const prompt = `
System Instructions:
${systemPrompt}

User:
${userMessage}
`;

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("❌ AI Service Error:", error.message);
    throw new Error("AI service is temporarily unavailable.");
  }
}