import express from "express";

import {
  analyzeResumeTarget,
  generateTargetedResume,
} from "../controllers/resumeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeResumeTarget);

router.post("/generate", authMiddleware, generateTargetedResume);

export default router;