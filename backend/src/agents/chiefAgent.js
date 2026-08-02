import ai from "../config/gemini.js";
import { routeToAgent } from "./orchestrator.js";

export async function askChiefAgent(message, history = []) {

  // Let specialist agents answer first
  const routedResponse = await routeToAgent(message);

  if (routedResponse) {
    return routedResponse;
  }

  try {

    const prompt = `
You are Chief AI of NEXORA AI OS.

Conversation History:
${history
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n")}

Current User Message:
${message}

Respond naturally while remembering the previous conversation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("Chief AI Error:", error);
    return "Chief AI is currently unavailable.";
  }
}