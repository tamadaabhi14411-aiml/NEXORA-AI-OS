import express from "express";

import {
  analyzeResumeTarget,
  generateTargetedResume,
  getResumes,
  getResumeById,
} from "../controllers/resumeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/resume/analyze",
  authMiddleware,
  analyzeResumeTarget
);

router.post(
  "/resume/generate",
  authMiddleware,
  generateTargetedResume
);

router.get(
  "/resume",
  authMiddleware,
  getResumes
);

router.get(
  "/resume/:id",
  authMiddleware,
  getResumeById
);

export default router;