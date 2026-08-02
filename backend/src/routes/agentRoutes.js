import express from "express";

import {
  chatWithAI,
  getHistory,
} from "../controllers/agentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// AI Chat
router.post("/chat", protect, chatWithAI);

// Conversation History
router.get("/history", protect, getHistory);

export default router;