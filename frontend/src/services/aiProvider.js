import chatService from "./chatService";
import { askPuterAI } from "./puterAI";

const PROVIDERS = {
  BACKEND: "backend",
  PUTER: "puter",
};

const sendBackendMessage = async (message) => {
  const response = await chatService.sendMessage(message);

  return {
    provider: PROVIDERS.BACKEND,
    data: response,
    historySupported: true,
  };
};

const sendPuterMessage = async (message) => {
  try {
    const response = await askPuterAI(message);

    if (!response || typeof response !== "string") {
      throw new Error("Puter AI did not return a response.");
    }

    return {
      provider: PROVIDERS.PUTER,
      message: response,
      historySupported: false,
    };
  } catch (error) {
    console.error("Puter provider error:", error);

    throw new Error(
      "NEXORA AI is temporarily unable to respond. Please try again."
    );
  }
};

const sendMessage = async (message, provider = PROVIDERS.BACKEND) => {
  if (provider === PROVIDERS.PUTER) {
    return sendPuterMessage(message);
  }

  try {
    return await sendBackendMessage(message);
  } catch (backendError) {
    console.error("Backend provider error:", backendError);

    try {
      console.warn("Falling back to Puter AI.");

      return await sendPuterMessage(message);
    } catch (puterError) {
      console.error("Puter fallback error:", puterError);

      throw new Error(
        "NEXORA AI is temporarily unable to respond. Please try again."
      );
    }
  }
};

const aiProvider = {
  PROVIDERS,
  sendMessage,
};

export default aiProvider;