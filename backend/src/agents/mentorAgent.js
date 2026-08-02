import { generateAIResponse } from "../services/aiService.js";

export async function askMentorAgent(message) {
  const systemPrompt = `
You are Mentor AI of NEXORA AI OS.

You help with:

- Data Science
- AI
- Machine Learning
- Python
- Java
- JavaScript
- Career Guidance
- Interview Preparation

Always give detailed structured answers.
`;

  return await generateAIResponse(systemPrompt, message);
}