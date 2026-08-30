import Conversation from "../models/Conversation.js";
import { askChiefAgent } from "../agents/chiefAgent.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const aiResponse = await askChiefAgent(message);

    const result =
      typeof aiResponse === "string"
        ? {
            agent: "Chief AI",
            reply: aiResponse,
          }
        : aiResponse;

    // Find existing conversation for the authenticated user
    let conversation = await Conversation.findOne({
      user: req.user.id,
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = new Conversation({
        user: req.user.id,
        messages: [],
      });
    }

    // Save user's message
    conversation.messages.push({
      role: "user",
      content: message.trim(),
    });

    // Save AI response
    conversation.messages.push({
      role: "assistant",
      content: result.reply,
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      message: "AI response generated successfully.",
      data: {
        conversation,
        agent: result.agent,
        reply: result.reply,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to process AI chat.",
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Conversation.find({
      user: req.user.id,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Conversation history retrieved successfully.",
      data: history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversation history.",
    });
  }
};

// Get one specific conversation
export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation retrieved successfully.",
      data: conversation,
    });
  } catch (error) {
    console.error(error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversation.",
    });
  }
};

// Alias for frontend/API compatibility
export const getChatHistory = getHistory;

export const deleteHistory = async (req, res) => {
  try {
    await Conversation.deleteMany({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Conversation history deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation history.",
    });
  }
};