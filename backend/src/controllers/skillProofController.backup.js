@'
import mongoose from "mongoose";
import Skill from "../models/Skill.js";
import SkillProof from "../models/SkillProof.js";

const getUserId = (req) => req.user?.id || req.user?._id;

const allowedProofTypes = [
  "Project",
  "Post",
  "Achievement",
  "Certificate",
  "Community Contribution",
];

// ==========================================
// CREATE SKILL PROOF
// POST /api/skills/:skillId/proofs
// ==========================================
export const createSkillProof = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = getUserId(req);

    const {
      type,
      title,
      description,
      project,
      post,
      evidenceUrl,
      community,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (!type || !allowedProofTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid proof type. Allowed types: Project, Post, Achievement, Certificate, Community Contribution.",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Proof title is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Proof description is required.",
      });
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (skill.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to create proof for this skill.",
      });
    }

    const proof = await SkillProof.create({
      user: userId,
      skill: skill._id,
      type,
      title: title.trim(),
      description: description.trim(),
      project: project || null,
      post: post || null,
      evidenceUrl: evidenceUrl?.trim() || "",
      community: community || null,
      status: "completed",
    });

    const populatedProof = await SkillProof.findById(proof._id)
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content")
      .populate("community", "name skill");

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

// ==========================================
// GET MY PROOFS FOR A SKILL
// GET /api/skills/:skillId/proofs
// ==========================================
export const getSkillProofs = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (skill.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access proofs for this skill.",
      });
    }

    const proofs = await SkillProof.find({
      user: userId,
      skill: skillId,
    })
      .populate("project", "title description")
      .populate("post", "content")
      .populate("community", "name skill")
      .select(
        "user skill type title description project post community evidenceUrl createdAt updatedAt status"
      )
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

// ==========================================
// DELETE PROOF
// DELETE /api/skills/:skillId/proofs/:proofId
// ==========================================
export const deleteSkillProof = async (req, res) => {
  try {
    const { skillId, proofId } = req.params;
    const userId = getUserId(req);

    if (
      !mongoose.Types.ObjectId.isValid(skillId) ||
      !mongoose.Types.ObjectId.isValid(proofId)
    ) {
      return res.status(404).json({
        success: false,
        message: "Skill proof not found.",
      });
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (skill.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this proof.",
      });
    }

    const proof = await SkillProof.findById(proofId);

    if (!proof) {
      return res.status(404).json({
        success: false,
        message: "Skill proof not found.",
      });
    }

    if (proof.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this proof.",
      });
    }

    if (proof.skill.toString() !== skillId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Skill proof does not belong to this skill.",
      });
    }

    await proof.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Skill proof deleted successfully.",
      data: {
        proofId,
      },
    });
  } catch (error) {
    console.error("Delete Skill Proof Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill proof.",
    });
  }
};

// ==========================================
// GET MY ALL PROOFS
// GET /api/skills/proofs/me
// ==========================================
export const getMySkillProofs = async (req, res) => {
  try {
    const userId = getUserId(req);

    const proofs = await SkillProof.find({
      user: userId,
    })
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("post", "content")
      .populate("community", "name skill")
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

// ==========================================
// GET PUBLIC USER PROOFS / SINGLE PROOF
// EXISTING API
// ==========================================
export const getUserOrSkillProof = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
    }

    const proof = await SkillProof.findById(identifier)
      .populate("user", "fullName avatar role")
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("community", "name skill");

    if (proof) {
      return res.status(200).json({
        success: true,
        message: "Skill proof retrieved successfully.",
        data: proof,
      });
    }

    const proofs = await SkillProof.find({
      user: identifier,
    })
      .populate("skill", "name level")
      .populate("project", "title description")
      .populate("community", "name skill")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User skill proofs retrieved successfully.",
      data: proofs,
    });
  } catch (error) {
    console.error("Get User/Skill Proof Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skill proofs.",
    });
  }
};
'@ | Set-Content src\controllers\skillProofController.js