import ChatHistory from "../models/ChatHistory.js";
import { askChiefAgent } from "../agents/chiefAgent.js";
import {
  getConversation,
  saveConversation,
  clearConversation,
} from "../services/conversationService.js";

// ===============================
// Chat with AI
// ===============================
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const userId = req.user._id;

    // Get previous conversation
    const conversation = await getConversation(userId);

    // Ask Chief AI with conversation history
    const reply = await askChiefAgent(
      message,
      conversation.messages
    );

    // Save current conversation
    await saveConversation(userId, "user", message);
    await saveConversation(userId, "assistant", reply);

    // Save chat history
    await ChatHistory.create({
      user: userId,
      message,
      reply,
    });

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("Agent Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Chat History
// ===============================
export const getHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({
      user: req.user._id,
    }).sort({ createdAt: 1 });

    return res.json({
      success: true,
      count: history.length,
      history,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Chat History
// ===============================
export const deleteHistory = async (req, res) => {
  try {
    await ChatHistory.deleteMany({
      user: req.user._id,
    });

    await clearConversation(req.user._id);

    return res.json({
      success: true,
      message: "Chat history deleted successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};