import express from "express";
import {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get skill feed
router.get("/", getFeed);

// Create post
router.post("/", authMiddleware, createPost);

// Get single post
router.get("/:postId", getPostById);

// Update post
router.put("/:postId", authMiddleware, updatePost);

// Delete post
router.delete("/:postId", authMiddleware, deletePost);

// Like post
router.post("/:postId/like", authMiddleware, likePost);

// Unlike post - existing API kept for compatibility
router.delete("/:postId/like", authMiddleware, unlikePost);

// Add comment
router.post("/:postId/comment", authMiddleware, addComment);

// Get comments
router.get("/:postId/comments", getComments);

export default router;