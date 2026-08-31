import express from "express";

import {
  chatWithAI,
  getHistory,
  getChatHistory,
  getConversationById,
  deleteHistory,
} from "../controllers/agentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// AI Chat
router.post("/chat", protect, chatWithAI);

// Conversation History
router.get("/history", protect, getHistory);

// Single Conversation
router.get("/history/:conversationId", protect, getConversationById);

router.get("/chat-history", protect, getChatHistory);

router.delete("/history", protect, deleteHistory);

export default router;