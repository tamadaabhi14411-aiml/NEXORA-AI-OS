import ai, { MODEL } from "../config/gemini.js";

export async function askSocietyAgent(message) {
  try {
    const prompt = `
You are Society AI of NEXORA AI OS.

Expertise:
- Education
- Healthcare
- Agriculture
- Environment
- Government
- Social Innovation
- Public Policy

Provide thoughtful, practical, and ethical solutions.

User Question:
${message}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return result.text;

  } catch (error) {
    console.error("Society AI Error:", error);
    return `Society AI Error: ${error.message}`;
  }
}