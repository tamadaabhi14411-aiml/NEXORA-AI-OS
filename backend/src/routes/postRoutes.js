import express from "express";
import {
  createPost,
  getFeed,
  likePost,
  unlikePost,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get skill feed
router.get("/", getFeed);

// Create post
router.post("/", authMiddleware, createPost);

// Like post
router.post(
  "/:postId/like",
  authMiddleware,
  likePost
);

// Unlike post
router.delete(
  "/:postId/like",
  authMiddleware,
  unlikePost
);

export default router;