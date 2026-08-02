import express from "express";

import {
  chatWithAI,
  getChatHistory,
  deleteHistory,
} from "../controllers/agentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", authMiddleware, chatWithAI);

router.get("/history", authMiddleware, getChatHistory);

router.delete("/history", authMiddleware, deleteHistory);

export default router;