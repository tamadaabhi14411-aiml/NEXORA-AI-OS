import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowCounts,
} from "../controllers/followController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Follow a user
router.post(
  "/:userId/follow",
  authMiddleware,
  followUser
);

// Unfollow a user
router.delete(
  "/:userId/follow",
  authMiddleware,
  unfollowUser
);

// Get follower/following counts
router.get(
  "/:userId/counts",
  authMiddleware,
  getFollowCounts
);

export default router;