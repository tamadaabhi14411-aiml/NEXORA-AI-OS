import chatService from "./chatService";
import { askPuterAI } from "./puterAI";

const PROVIDERS = {
  BACKEND: "backend",
  PUTER: "puter",
};

// --------------------------------------------------
// BACKEND AI
// --------------------------------------------------
const sendBackendMessage = async (message) => {
  const response = await chatService.sendMessage(message);

  console.log("BACKEND RESPONSE:", response);

  return {
    provider: PROVIDERS.BACKEND,
    data: response,
    historySupported: true,
  };
};

// --------------------------------------------------
// PUTER AI
// --------------------------------------------------
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

// --------------------------------------------------
// MAIN AI PROVIDER
// --------------------------------------------------
const sendMessage = async (
  message,
  provider = PROVIDERS.BACKEND
) => {
  // If Puter is explicitly selected
  if (provider === PROVIDERS.PUTER) {
    return sendPuterMessage(message);
  }

  // Try backend first
  try {
    return await sendBackendMessage(message);
  } catch (backendError) {
    console.error(
      "Backend provider error:",
      backendError
    );

    // Fallback to Puter
    try {
      console.warn("Falling back to Puter AI.");

      return await sendPuterMessage(message);
    } catch (puterError) {
      console.error(
        "Puter fallback error:",
        puterError
      );

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