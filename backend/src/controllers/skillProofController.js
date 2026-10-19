
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

const sendError = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

// CREATE SKILL PROOF
export const createSkillProof = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id: skillId } = req.params;

    if (!userId) {
      return sendError(res, 401, "Unauthorized.");
    }

    const {
      type,
      title,
      description,
      projectId,
      project,
      post,
      proofUrl,
      evidenceUrl,
    } = req.body;

    const linkedProjectId = projectId || project || null;
    const linkedProofUrl = proofUrl ?? evidenceUrl ?? "";

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      !type
    ) {
      return sendError(
        res,
        400,
        "Title, type and description are required."
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return sendError(res, 400, "Invalid proof type.");
    }

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return sendError(res, 404, "Skill not found.");
    }

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return sendError(res, 404, "Skill not found.");
    }

    // A project link is optional. If supplied, verify ownership/access.
    if (linkedProjectId) {
      if (!mongoose.Types.ObjectId.isValid(linkedProjectId)) {
        return sendError(res, 400, "Invalid project ID.");
      }

      const projectRecord = await Project.findOne({
        _id: linkedProjectId,
        $or: [
          { owner: userId },
          { members: userId },
        ],
      });

      if (!projectRecord) {
        return sendError(
          res,
          403,
          "You are not authorized to use this project."
        );
      }
    }

    // Keep the existing database field names for compatibility.
    const proof = await SkillProof.create({
      user: userId,
      skill: skillId,
      type,
      title: title.trim(),
      description: description.trim(),
      project: linkedProjectId,
      post: post || null,
      evidenceUrl:
        typeof linkedProofUrl === "string"
          ? linkedProofUrl.trim()
          : "",
    });

    const populatedProof = await SkillProof.findById(proof._id)
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content");

    const data = populatedProof.toObject();

    // Expose the API field names while retaining legacy fields.
    data.skillId = data.skill?._id || skillId;
    data.userId = data.user?._id || userId;
    data.projectId = data.project?._id || data.project || null;
    data.proofUrl = data.evidenceUrl || "";

    return res.status(201).json({
      success: true,
      message: "Proof created successfully.",
      data,
    });
  } catch (error) {
    console.error("Create Skill Proof Error:", error);

    if (error.code === 11000) {
      return sendError(res, 409, "This proof already exists.");
    }

    if (error.name === "ValidationError") {
      return sendError(res, 400, "Invalid skill proof data.");
    }

    return sendError(res, 500, "Failed to create skill proof.");
  }
};

// GET PROOFS FOR AN OWNED SKILL
export const getSkillProofs = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id: skillId } = req.params;

    if (!userId) {
      return sendError(res, 401, "Unauthorized.");
    }

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return sendError(res, 404, "Skill not found.");
    }

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return sendError(res, 404, "Skill not found.");
    }

    const proofs = await SkillProof.find({
      skill: skillId,
      user: userId,
    })
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content")
      .sort({ createdAt: -1 });

    const data = proofs.map((proof) => {
      const item = proof.toObject();

      item.skillId = item.skill?._id || skillId;
      item.userId = item.user?._id || userId;
      item.projectId = item.project?._id || item.project || null;
      item.proofUrl = item.evidenceUrl || "";

      return item;
    });

    return res.status(200).json({
      success: true,
      message: "Proofs retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Get Skill Proofs Error:", error);

    return sendError(res, 500, "Failed to retrieve skill proofs.");
  }
};

// DELETE A PROOF BELONGING TO AN OWNED SKILL
export const deleteSkillProof = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { skillId, proofId } = req.params;

    if (!userId) {
      return sendError(res, 401, "Unauthorized.");
    }

    if (
      !mongoose.Types.ObjectId.isValid(skillId) ||
      !mongoose.Types.ObjectId.isValid(proofId)
    ) {
      return sendError(res, 404, "Skill proof not found.");
    }

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return sendError(res, 404, "Skill not found.");
    }

    const proof = await SkillProof.findOne({
      _id: proofId,
      skill: skillId,
      user: userId,
    });

    if (!proof) {
      return sendError(res, 404, "Skill proof not found.");
    }

    await SkillProof.deleteOne({
      _id: proof._id,
      skill: skillId,
      user: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Proof deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Skill Proof Error:", error);

    return sendError(res, 500, "Failed to delete skill proof.");
  }
};

// GET ALL PROOFS FOR THE AUTHENTICATED USER
// Kept for backward compatibility with existing imports.
export const getMySkillProofs = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return sendError(res, 401, "Unauthorized.");
    }

    const proofs = await SkillProof.find({
      user: userId,
    })
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content")
      .sort({ createdAt: -1 });

    const data = proofs.map((proof) => {
      const item = proof.toObject();

      item.skillId = item.skill?._id || item.skill || null;
      item.userId = item.user?._id || item.user || userId;
      item.projectId = item.project?._id || item.project || null;
      item.proofUrl = item.evidenceUrl || "";

      return item;
    });

    return res.status(200).json({
      success: true,
      message: "My skill proofs retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Get My Skill Proofs Error:", error);

    return sendError(res, 500, "Failed to retrieve skill proofs.");
  }
};
