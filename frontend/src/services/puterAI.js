import { puter } from "@heyputer/puter.js";

export const askPuterAI = async (message) => {
  try {
    const response = await puter.ai.chat(message, {
      model: "gpt-5.6-luna",
      normalize: true,
    });

    return response?.message?.content ?? "";
  } catch (error) {
    console.error("Puter AI error:", error);
    throw error;
  }
};
