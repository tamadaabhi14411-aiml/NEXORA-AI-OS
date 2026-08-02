import Conversation from "../models/Conversation.js";
import { askChiefAgent } from "../agents/chiefAgent.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const aiResponse = await askChiefAgent(message);

    const conversation = await Conversation.create({
      user: req.user.id,
      message,
      agent: aiResponse.agent,
      reply: aiResponse.reply,
    });

    res.status(200).json({
      success: true,
      conversation,
      ...aiResponse,
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