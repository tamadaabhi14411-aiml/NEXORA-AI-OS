import express from "express";

import {
  getUserOrSkillProof,
  getMySkillProofs,
} from "../controllers/skillProofController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// My skill proofs
router.get("/proofs/me", authMiddleware, getMySkillProofs);

// Public user proofs OR skill proof details
router.get("/proofs/:identifier", getUserOrSkillProof);

export default router;