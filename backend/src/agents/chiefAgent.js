import { routeToAgent } from "./orchestrator.js";
import { generateAIResponse } from "../services/aiService.js";

export async function askChiefAgent(message, history = []) {

  // Check specialist agents first
  const routedResponse = await routeToAgent(message);

  if (routedResponse) {
    return routedResponse;
  }

  const historyText = history
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const systemPrompt = `
You are Chief AI of NEXORA AI OS.

You are the master AI assistant.

Responsibilities:

- General conversations
- Personal memory
- Productivity
- Study planning
- Career advice
- Project management

Always answer professionally.

Conversation History:

${historyText}
`;

  return await generateAIResponse(systemPrompt, message);
}