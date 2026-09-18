import Project from "../models/Project.js";
import Community from "../models/Community.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, skill, communityId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project description is required.",
      });
    }

    if (!skill || !skill.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project skill is required.",
      });
    }

    let community = null;

    if (communityId) {
      community = await Community.findById(communityId);

      if (!community) {
        return res.status(404).json({
          success: false,
          message: "Community not found.",
        });
      }

      const isMember =
        community.leader.toString() === req.user._id.toString() ||
        community.members.some(
          (memberId) =>
            memberId.toString() === req.user._id.toString()
        );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Only community members can create a project.",
        });
      }
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      skill: skill.trim(),
      community: communityId || null,
      owner: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
};

// GET PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "fullName avatar role")
      .populate("community", "name skill description")
      .sort({ createdAt: -1 })
      .lean();

    const data = projects.map((project) => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      skill: project.skill,
      owner: project.owner,
      community: project.community,
      memberCount: project.members.length,
      status: project.status,
      createdAt: project.createdAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve projects.",
    });
  }
};

// GET PROJECT DETAILS
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner", "fullName avatar role")
      .populate("members", "fullName avatar role")
      .populate("community", "name skill description")
      .populate("tasks.assignedTo", "fullName avatar role")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve project.",
    });
  }
};

// JOIN PROJECT
export const joinProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const alreadyMember = project.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "You are already a project member.",
      });
    }

    if (project.community) {
      const community = await Community.findById(project.community);

      if (!community) {
        return res.status(404).json({
          success: false,
          message: "Community not found.",
        });
      }

      const isCommunityMember =
        community.leader.toString() === userId.toString() ||
        community.members.some(
          (memberId) =>
            memberId.toString() === userId.toString()
        );

      if (!isCommunityMember) {
        return res.status(403).json({
          success: false,
          message: "You must be a community member to join this project.",
        });
      }
    }

    project.members.push(userId);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Joined project successfully.",
      data: {
        projectId: project._id,
        memberCount: project.members.length,
      },
    });
  } catch (error) {
    console.error("Join Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join project.",
    });
  }
};

// LEAVE PROJECT
export const leaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (project.owner.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Project owner cannot leave without transferring ownership.",
      });
    }

    const memberIndex = project.members.findIndex(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "You are not a project member.",
      });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Left project successfully.",
      data: {
        projectId: project._id,
        memberCount: project.members.length,
      },
    });
  } catch (error) {
    console.error("Leave Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave project.",
    });
  }
};

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Only project members can create tasks.",
      });
    }

    project.tasks.push({
      title: title.trim(),
      description: description?.trim() || "",
    });

    await project.save();

    const task = project.tasks[project.tasks.length - 1];

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { status, assignedTo } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Only project members can update tasks.",
      });
    }

    const task = project.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    if (status !== undefined) {
      if (!["todo", "in_progress", "completed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status.",
        });
      }

      task.status = status;
    }

    if (assignedTo !== undefined) {
      const isProjectMember = project.members.some(
        (memberId) => memberId.toString() === assignedTo.toString()
      );

      if (!isProjectMember) {
        return res.status(403).json({
          success: false,
          message: "Task can only be assigned to a project member.",
        });
      }

      task.assignedTo = assignedTo;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task.",
    });
  }
};

// COMPLETE PROJECT
export const completeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (project.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can complete the project.",
      });
    }

    const allTasksCompleted = project.tasks.every(
      (task) => task.status === "completed"
    );

    if (!allTasksCompleted) {
      return res.status(400).json({
        success: false,
        message: "All project tasks must be completed first.",
      });
    }

    project.status = "completed";
    project.completedAt = new Date();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project completed successfully.",
      data: {
        projectId: project._id,
        status: project.status,
        completedAt: project.completedAt,
        skillProof: {
          user: project.owner,
          skill: project.skill,
          project: project._id,
          contribution: "Project owner",
        },
      },
    });
  } catch (error) {
    console.error("Complete Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete project.",
    });
  }
};