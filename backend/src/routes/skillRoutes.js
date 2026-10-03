import express from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

import {
  createSkillProof,
  getSkillProofs,
  deleteSkillProof,
} from "../controllers/skillProofController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// SKILLS
// ===============================

// Get authenticated user's skills
router.get("/", authMiddleware, getSkills);

// Create skill
router.post("/", authMiddleware, createSkill);

// Get single owned skill
router.get("/:id", authMiddleware, getSkillById);

// Update owned skill
router.put("/:id", authMiddleware, updateSkill);

// Delete owned skill + related proofs
router.delete("/:id", authMiddleware, deleteSkill);

// ===============================
// SKILL PROOFS
// ===============================

// Create proof for owned skill
router.post("/:id/proofs", authMiddleware, createSkillProof);

// Get proofs for owned skill
router.get("/:id/proofs", authMiddleware, getSkillProofs);

// Delete proof belonging to owned skill
router.delete(
  "/:skillId/proofs/:proofId",
  authMiddleware,
  deleteSkillProof
);

export default router;