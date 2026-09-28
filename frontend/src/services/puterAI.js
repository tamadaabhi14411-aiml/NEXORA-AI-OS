import { puter } from "@heyputer/puter.js";

const getAvailableModel = async () => {
  const models = await puter.ai.listModels();

  if (!Array.isArray(models) || models.length === 0) {
    throw new Error("No Puter AI models are available.");
  }

  // Prefer the documented NEXORA test model if the environment exposes it.
  const preferredModel = models.find(
    (model) => model.id === "gpt-5.6-luna"
  );

  return preferredModel?.id || models[0].id;
};

export const askPuterAI = async (message) => {
  try {
    const model = await getAvailableModel();

    console.log("PUTER MODEL:", model);

    const response = await puter.ai.chat(message, {
      model,
      normalize: true,
    });

    const content = response?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Puter AI returned an empty response.");
    }

    return content;
  } catch (error) {
    console.error("Puter AI error:", error);
    throw new Error("Puter AI is temporarily unavailable.");
  }
};

export const getPuterModels = async () => {
  try {
    const models = await puter.ai.listModels();

    return Array.isArray(models) ? models : [];
  } catch (error) {
    console.error("Puter model discovery error:", error);
    throw new Error("Unable to discover Puter AI models.");
  }
};