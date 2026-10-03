import express from "express";
import {
  getProfile,
  getPublicProfile,
  updateProfile,
} from "../controllers/userController.js";
import { getUserSkills } from "../controllers/skillController.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/followController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Skill Identity
router.get("/public/:userId", getPublicProfile);

// Get logged-in user's private profile
router.get("/profile", authMiddleware, getProfile);

// Update logged-in user's profile
router.put("/profile", authMiddleware, updateProfile);

// Follow / Unfollow
router.post("/:userId/follow", authMiddleware, followUser);
router.delete("/:userId/follow", authMiddleware, unfollowUser);

// Followers / Following
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

// Get user's skills
router.get("/:id/skills", getUserSkills);

export default router;