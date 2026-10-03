import express from "express";

import {
  createCommunity,
  listCommunities,
  getCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers,
  getCommunityPosts,
  createCommunityPost,
  getCommunityProjects,
} from "../controllers/communityController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// COMMUNITY
// ============================================

// Create
router.post(
  "/",
  authMiddleware,
  createCommunity
);

// List
router.get(
  "/",
  listCommunities
);

// Single community
router.get(
  "/:communityId",
  getCommunity
);

// Update
router.put(
  "/:communityId",
  authMiddleware,
  updateCommunity
);

// Delete
router.delete(
  "/:communityId",
  authMiddleware,
  deleteCommunity
);

// ============================================
// MEMBERSHIP
// ============================================

// Join
router.post(
  "/:communityId/join",
  authMiddleware,
  joinCommunity
);

// Leave
router.delete(
  "/:communityId/join",
  authMiddleware,
  leaveCommunity
);

// Backward-compatible leave endpoint
router.delete(
  "/:communityId/leave",
  authMiddleware,
  leaveCommunity
);

// Members
router.get(
  "/:communityId/members",
  getCommunityMembers
);

// ============================================
// POSTS
// ============================================

// Get posts
router.get(
  "/:communityId/posts",
  getCommunityPosts
);

// Create post
router.post(
  "/:communityId/posts",
  authMiddleware,
  createCommunityPost
);

// ============================================
// PROJECTS
// ============================================

router.get(
  "/:communityId/projects",
  getCommunityProjects
);

export default router;