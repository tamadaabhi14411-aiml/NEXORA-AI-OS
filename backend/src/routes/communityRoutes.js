import express from "express";
import {
  listCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
} from "../controllers/communityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// List all communities
router.get("/", listCommunities);

// Get a single community
router.get("/:communityId", getCommunity);

// Join a community
router.post(
  "/:communityId/join",
  authMiddleware,
  joinCommunity
);

// Leave a community
router.delete(
  "/:communityId/leave",
  authMiddleware,
  leaveCommunity
);

export default router;
