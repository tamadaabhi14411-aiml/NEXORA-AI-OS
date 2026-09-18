import mongoose from "mongoose";
import SkillProof from "../models/SkillProof.js";

// GET USER PROOFS OR SKILL PROOF DETAILS
export const getUserOrSkillProof = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
    }

    // First check whether the ID belongs to a SkillProof
    const proof = await SkillProof.findById(identifier)
      .populate("user", "fullName avatar role")
      .populate("project", "title description")
      .populate("community", "name skill")
      .select(
        "user skill project community contribution status createdAt"
      );

    if (proof) {
      return res.status(200).json({
        success: true,
        message: "Skill proof retrieved successfully.",
        data: proof,
      });
    }

    // Otherwise treat the ID as a user ID
    const proofs = await SkillProof.find({
      user: identifier,
    })
      .populate("project", "title description")
      .populate("community", "name skill")
      .select(
        "skill project community contribution status createdAt"
      )
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

// GET MY SKILL PROOFS
export const getMySkillProofs = async (req, res) => {
  try {
    const proofs = await SkillProof.find({
      user: req.user._id,
    })
      .populate("project", "title description")
      .populate("community", "name skill")
      .select(
        "skill project community contribution status createdAt"
      )
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