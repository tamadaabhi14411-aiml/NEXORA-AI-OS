import express from "express";

import {
  createSkillProof,
  getSkillProofs,
  deleteSkillProof,
} from "../controllers/skillProofController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create proof for a skill
router.post(
  "/:id/proofs",
  authMiddleware,
  createSkillProof
);

// Get proofs for a skill
router.get(
  "/:id/proofs",
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