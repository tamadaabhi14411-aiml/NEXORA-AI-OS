import ai, { MODEL } from "../config/gemini.js";

export async function askQAAgent(message) {
  try {
    const prompt = `
You are QA AI of NEXORA AI OS.

Expertise:
- Manual Testing
- Automation Testing
- API Testing
- Unit Testing
- Integration Testing
- Performance Testing
- Bug Reporting

Always explain testing strategy clearly.

User Question:
${message}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return result.text;

  } catch (error) {
    console.error("QA AI Error:", error);
    return `QA AI Error: ${error.message}`;
  }
}