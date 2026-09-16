import express from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  followSkill,
  unfollowSkill,
  getUserSkills,
} from "../controllers/skillController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create skill
router.post("/", authMiddleware, createSkill);

// Get all / search skills
router.get("/", getSkills);

// Get user's skills
router.get("/user/:id", getUserSkills);

// Get single skill
router.get("/:id", getSkillById);

// Follow skill
router.post("/:id/follow", authMiddleware, followSkill);

// Remove / unfollow skill
router.delete("/:id/follow", authMiddleware, unfollowSkill);

export default router;