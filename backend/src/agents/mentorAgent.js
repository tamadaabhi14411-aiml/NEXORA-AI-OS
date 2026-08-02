import ai from "../config/gemini.js";

export async function askMentorAgent(message) {
  try {
    const prompt = `
You are Mentor AI of NEXORA AI OS.

Responsibilities:
- Data Science
- AI & Machine Learning
- Python
- Java
- JavaScript
- Web Development
- Career Guidance
- Interview Preparation

Always give detailed, structured, practical answers.

User Question:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    console.log("Gemini Response:", response);

    return response.text || "No response generated.";

  } catch (error) {
    console.error("========== MENTOR AI ERROR ==========");
    console.error(error);
    console.error("====================================");

    return `Mentor AI Error: ${error.message}`;
  }
}