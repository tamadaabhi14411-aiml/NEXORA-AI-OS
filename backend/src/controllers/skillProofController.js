import mongoose from "mongoose";
import Skill from "../models/Skill.js";
import SkillProof from "../models/SkillProof.js";
import Project from "../models/Project.js";

const getUserId = (req) => req.user?.id || req.user?._id;

const VALID_TYPES = [
  "Project",
  "Post",
  "Achievement",
  "Certificate",
  "Community Contribution",
];

// CREATE SKILL PROOF
export const createSkillProof = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id: skillId } = req.params;
    const {
      type,
      title,
      description,
      project,
      post,
      evidenceUrl,
    } = req.body;

    if (!title || !title.trim() || !type || !description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, type and description are required.",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid proof type.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    // Project reference is optional.
    // If supplied, verify that it belongs to the current user.
    if (project) {
      if (!mongoose.Types.ObjectId.isValid(project)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const projectRecord = await Project.findOne({
        _id: project,
        $or: [
          { owner: userId },
          { members: userId },
        ],
      });

      if (!projectRecord) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to use this project.",
        });
      }
    }

    const proof = await SkillProof.create({
      user: userId,
      skill: skillId,
      type,
      title: title.trim(),
      description: description.trim(),
      project: project || null,
      post: post || null,
      evidenceUrl: evidenceUrl?.trim() || "",
    });

    const populatedProof = await SkillProof.findById(proof._id)
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content");

    return res.status(201).json({
      success: true,
      message: "Skill proof created successfully.",
      data: populatedProof,
    });
  } catch (error) {
    console.error("Create Skill Proof Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create skill proof.",
    });
  }
};

// GET PROOFS FOR MY SKILL
export const getSkillProofs = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id: skillId } = req.params;

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const proofs = await SkillProof.find({
      skill: skillId,
      user: userId,
    })
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Skill proofs retrieved successfully.",
      data: proofs,
    });
  } catch (error) {
    console.error("Get Skill Proofs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skill proofs.",
    });
  }
};

// DELETE SKILL PROOF
export const deleteSkillProof = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { skillId, proofId } = req.params;

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const proof = await SkillProof.findOne({
      _id: proofId,
      skill: skillId,
      user: userId,
    });

    if (!proof) {
      return res.status(404).json({
        success: false,
        message: "Skill proof not found.",
      });
    }

    await SkillProof.deleteOne({
      _id: proof._id,
      skill: skillId,
      user: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Skill proof deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Skill Proof Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill proof.",
    });
  }
};

// GET MY SKILL PROOFS
export const getMySkillProofs = async (req, res) => {
  try {
    const userId = getUserId(req);

    const proofs = await SkillProof.find({
      user: userId,
    })
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "My skill proofs retrieved successfully.",
      data: proofs,
    });
  } catch (error) {
    console.error("Get My Skill Proofs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skill proofs.",
    });
  }
};