@'
import express from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  followSkill,
  unfollowSkill,
  getUserSkills,
} from "../controllers/skillController.js";

import {
  createSkillProof,
  getSkillProofs,
  deleteSkillProof,
} from "../controllers/skillProofController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// SKILLS
// ==========================================

// My skills
router.get("/", authMiddleware, getSkills);

// Create skill
router.post("/", authMiddleware, createSkill);

// Existing public/user skills
router.get("/user/:id", getUserSkills);

// Single skill
router.get("/:id", authMiddleware, getSkillById);

// Update skill
router.put("/:id", authMiddleware, updateSkill);

// Delete skill
router.delete("/:id", authMiddleware, deleteSkill);

// Existing follow functionality
router.post("/:id/follow", authMiddleware, followSkill);

router.delete("/:id/follow", authMiddleware, unfollowSkill);

// ==========================================
// SKILL PROOFS
// ==========================================

// Create proof
router.post(
  "/:skillId/proofs",
  authMiddleware,
  createSkillProof
);

// Get proofs for skill
router.get(
  "/:skillId/proofs",
  authMiddleware,
  getSkillProofs
);

// Delete proof
router.delete(
  "/:skillId/proofs/:proofId",
  authMiddleware,
  deleteSkillProof
);

export default router;
'@ | Set-Content src\routes\skillRoutes.js