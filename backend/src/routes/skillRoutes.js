import express from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  followSkill,
  unfollowSkill,
  getUserSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create skill
router.post("/", authMiddleware, createSkill);

// Get all skills
router.get("/", getSkills);

// Get user's skills
router.get("/user/:id", getUserSkills);

// Get single skill
router.get("/:id", authMiddleware, getSkillById);

// Update skill
router.put("/:id", authMiddleware, updateSkill);

// Delete skill
router.delete("/:id", authMiddleware, deleteSkill);

// Follow skill
router.post("/:id/follow", authMiddleware, followSkill);

// Unfollow skill
router.delete("/:id/follow", authMiddleware, unfollowSkill);

export default router;