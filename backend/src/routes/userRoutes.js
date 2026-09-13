import express from "express";
import {
  getProfile,
  getPublicProfile,
  updateProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Skill Identity
router.get("/public/:userId", getPublicProfile);

// Get logged-in user's private profile
router.get("/profile", authMiddleware, getProfile);

// Update logged-in user's profile
router.put("/profile", authMiddleware, updateProfile);

export default router;