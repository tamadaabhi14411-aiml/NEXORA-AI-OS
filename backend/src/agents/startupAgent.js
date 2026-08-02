import ai from "../config/gemini.js";

export async function askStartupAgent(message) {
  try {
    const prompt = `
You are Startup AI of NEXORA AI OS.

Responsibilities:
- Startup Ideas
- Business Strategy
- MVP Planning
- Funding
- Product Roadmap

User Question:
${message}
`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return result.text;

  } catch (error) {
    console.error("Startup AI Error:", error);
    return "Startup AI is currently unavailable.";
  }
}