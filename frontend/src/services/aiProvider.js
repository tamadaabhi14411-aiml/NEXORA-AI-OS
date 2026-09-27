import chatService from "./chatService";
import { askPuterAI } from "./puterAI";

const PROVIDERS = {
  AUTO: "auto",
  BACKEND: "backend",
  PUTER: "puter",
};

// --------------------------------------------------
// BACKEND AI
// --------------------------------------------------
const sendBackendMessage = async (message) => {
  const response = await chatService.sendMessage(message);

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

    if (
      typeof response !== "string" ||
      !response.trim()
    ) {
      throw new Error(
        "Puter AI did not return a valid response."
      );
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
// AUTO / NEXORA AI
// Backend first ? Puter fallback
// --------------------------------------------------
const sendAutoMessage = async (message) => {
  try {
    return await sendBackendMessage(message);
  } catch (backendError) {
    console.warn(
      "Backend AI unavailable. Trying Puter AI fallback."
    );

    try {
      return await sendPuterMessage(message);
    } catch (puterError) {
      console.error(
        "NEXORA AI provider error:",
        puterError
      );

      throw new Error(
        "NEXORA AI is temporarily unable to respond. Please try again."
      );
    }
  }
};

// --------------------------------------------------
// MAIN AI PROVIDER
// --------------------------------------------------
const sendMessage = async (
  message,
  provider = PROVIDERS.AUTO
) => {
  if (!message || !message.trim()) {
    throw new Error(
      "Please enter a message before asking NEXORA AI."
    );
  }

  if (provider === PROVIDERS.PUTER) {
    return sendPuterMessage(message);
  }

  if (provider === PROVIDERS.BACKEND) {
    return sendBackendMessage(message);
  }

  return sendAutoMessage(message);
};

const aiProvider = {
  PROVIDERS,
  sendMessage,
};

export default aiProvider;
