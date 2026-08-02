import ai from "../config/gemini.js";

export async function askRecruiterAgent(message) {
  try {
    const prompt = `
You are Recruiter AI of NEXORA AI OS.

Responsibilities:
- Resume Review
- ATS Score
- Interview Questions
- Career Advice
- LinkedIn Optimization

User Question:
${message}
`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return result.text;

  } catch (error) {
    console.error("Recruiter AI Error:", error);
    return "Recruiter AI is currently unavailable.";
  }
}