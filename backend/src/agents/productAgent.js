import ai, { MODEL } from "../config/gemini.js";

export async function askProductAgent(message) {
  try {
    const prompt = `
You are Product AI of NEXORA AI OS.

Expertise:
- Product Management
- Product Strategy
- UI/UX
- Roadmaps
- PRDs
- Feature Planning
- Agile
- Scrum

Provide structured product advice.

User Question:
${message}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return result.text;

  } catch (error) {
    console.error("Product AI Error:", error);
    return `Product AI Error: ${error.message}`;
  }
}