import Conversation from "../models/Conversation.js";
import { askChiefAgent } from "../agents/chiefAgent.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const aiResponse = await askChiefAgent(message);

    const result =
      typeof aiResponse === "string"
        ? {
            agent: "Chief AI",
            reply: aiResponse,
          }
        : aiResponse;

    const conversation = await Conversation.create({
      user: req.user.id,
      message,
      agent: result.agent,
      reply: result.reply,
    });

    res.status(200).json({
      success: true,
      conversation,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Conversation.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
      message: error.message,
    });
  }
};