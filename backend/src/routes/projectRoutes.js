import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  joinProject,
  leaveProject,
  createTask,
  updateTask,
  completeProject,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all projects
router.get("/", getProjects);

// Create project
router.post("/", authMiddleware, createProject);

// Get project details
router.get("/:projectId", getProjectById);

// Join project
router.post("/:projectId/join", authMiddleware, joinProject);

// Leave project
router.post("/:projectId/leave", authMiddleware, leaveProject);

// Create task
router.post(
  "/:projectId/tasks",
  authMiddleware,
  createTask
);

// Update task / assign task
router.put(
  "/:projectId/tasks/:taskId",
  authMiddleware,
  updateTask
);

// Complete project
router.put(
  "/:projectId/complete",
  authMiddleware,
  completeProject
);

export default router;