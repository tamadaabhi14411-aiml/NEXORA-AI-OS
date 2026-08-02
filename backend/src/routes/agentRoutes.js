import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  chatWithAI,
  getHistory,
  deleteHistory,
} from "../controllers/agentController.js";

const router = express.Router();

// Chat with AI
router.post("/chat", authMiddleware, chatWithAI);

// Get chat history
router.get("/history", authMiddleware, getHistory);

// Delete chat history
router.delete("/history", authMiddleware, deleteHistory);

export default router;