import express from "express";

import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  getComments,
  createComment,
  deleteComment,
  savePost,
  unsavePost,
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Feed
router.get("/", authMiddleware, getPosts);

// Create post
router.post("/", authMiddleware, createPost);

// Single post
router.get("/:id", getPostById);

// Delete post
router.delete("/:id", authMiddleware, deletePost);

// Like / Unlike
router.post("/:id/like", authMiddleware, likePost);
router.delete("/:id/like", authMiddleware, unlikePost);

// Comments
router.get("/:id/comments", getComments);
router.post("/:id/comments", authMiddleware, createComment);
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  deleteComment
);

// Save / Unsave
router.post("/:id/save", authMiddleware, savePost);
router.delete("/:id/save", authMiddleware, unsavePost);

export default router;