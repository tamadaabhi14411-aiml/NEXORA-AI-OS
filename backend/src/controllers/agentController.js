import Conversation from "../models/Conversation.js";
import { askChiefAgent } from "../agents/chiefAgent.js";
import { extractMemory } from "../utils/memoryExtractor.js";
import { saveMemory } from "../services/memoryService.js";

// ============================================
// AI CHAT
// ============================================

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const cleanMessage = message.trim();

    // ============================================
    // Generate AI Response
    // ============================================

    const aiResponse = await askChiefAgent(cleanMessage);

    const result =
      typeof aiResponse === "string"
        ? {
            agent: "Chief AI",
            reply: aiResponse,
          }
        : aiResponse;

    // ============================================
    // Extract Career Memory
    // ============================================

    try {
      const memoryUpdates = extractMemory(cleanMessage);

      if (
        memoryUpdates &&
        Object.keys(memoryUpdates).length > 0
      ) {
        await saveMemory(
          req.user._id,
          memoryUpdates
        );

        console.log(
          "Career memory updated successfully."
        );
      }
    } catch (memoryError) {
      // Memory failure should NOT break AI chat
      console.error(
        "Memory Save Error:",
        memoryError
      );
    }

    // ============================================
    // Find Existing Conversation
    // ============================================

    let conversation = await Conversation.findOne({
      user: req.user._id,
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = new Conversation({
        user: req.user._id,
        messages: [],
      });
    }

    // ============================================
    // Save User Message
    // ============================================

    conversation.messages.push({
      role: "user",
      content: cleanMessage,
    });

    // ============================================
    // Save AI Response
    // ============================================

    conversation.messages.push({
      role: "assistant",
      content: result.reply,
    });

    await conversation.save();

    // ============================================
    // Response
    // ============================================

    return res.status(200).json({
      success: true,
      message: "AI response generated successfully.",
      data: {
        conversation,
        agent: result.agent,
        reply: result.reply,
      },
    });
  } catch (error) {
    console.error(
      "AI Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to process AI chat.",
    });
  }
};

// ============================================
// GET CONVERSATION HISTORY
// ============================================

export const getHistory = async (req, res) => {
  try {
    const history = await Conversation.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      message:
        "Conversation history retrieved successfully.",
      data: history,
    });
  } catch (error) {
    console.error(
      "Get History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve conversation history.",
    });
  }
};

// ============================================
// GET ONE CONVERSATION
// ============================================

export const getConversationById = async (
  req,
  res
) => {
  try {
    const { conversationId } = req.params;

    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Conversation retrieved successfully.",
      data: conversation,
    });
  } catch (error) {
    console.error(
      "Get Conversation Error:",
      error
    );

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve conversation.",
    });
  }
};

// ============================================
// CHAT HISTORY ALIAS
// ============================================

export const getChatHistory = getHistory;

// ============================================
// DELETE CONVERSATION HISTORY
// ============================================

export const deleteHistory = async (
  req,
  res
) => {
  try {
    await Conversation.deleteMany({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Conversation history deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete conversation history.",
    });
  }
};