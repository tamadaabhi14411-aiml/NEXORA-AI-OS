import ChatHistory from "../models/ChatHistory.js";
import { askChiefAgent } from "../agents/chiefAgent.js";
import { extractMemory } from "../utils/memoryExtractor.js";
import { saveMemory } from "../services/memoryService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Get previous conversation
    const history = await ChatHistory.find({
      user: req.user.id,
    }).sort({ createdAt: 1 });

    // Ask Chief AI
    const reply = await askChiefAgent(message, history);

    // Extract and save memory
    const updates = extractMemory(message);

    if (Object.keys(updates).length > 0) {
      await saveMemory(req.user.id, updates);
    }

    // Save user message
    await ChatHistory.create({
      user: req.user.id,
      role: "user",
      content: message,
    });

    // Save AI reply
    await ChatHistory.create({
      user: req.user.id,
      role: "assistant",
      content: reply,
    });

    return res.status(200).json({
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