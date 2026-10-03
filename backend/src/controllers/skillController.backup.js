@'
import mongoose from "mongoose";
import Skill from "../models/Skill.js";
import SkillProof from "../models/SkillProof.js";
import User from "../models/User.js";

const getUserId = (req) => req.user?.id || req.user?._id;

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==========================================
// GET MY SKILLS
// GET /api/skills
// ==========================================
export const getSkills = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { search } = req.query;

    const filter = { user: userId };

    if (search && search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skills = await Skill.find(filter)
      .select("_id user name level description followers createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    const data = skills.map((skill) => ({
      ...skill,
      followerCount: skill.followers?.length || 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Skills retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Get Skills Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skills.",
    });
  }
};

// ==========================================
// CREATE SKILL
// POST /api/skills
// ==========================================
export const createSkill = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name, level, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required.",
      });
    }

    const allowedLevels = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    const skillLevel = level || "Beginner";

    if (!allowedLevels.includes(skillLevel)) {
      return res.status(400).json({
        success: false,
        message:
          "Skill level must be Beginner, Intermediate, or Advanced.",
      });
    }

    const existingSkill = await Skill.findOne({
      user: userId,
      name: {
        $regex: `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "You already have this skill.",
        data: existingSkill,
      });
    }

    const skill = await Skill.create({
      user: userId,
      name: name.trim(),
      level: skillLevel,
      description: description?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("Create Skill Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have this skill.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create skill.",
    });
  }
};

// ==========================================
// GET SINGLE MY SKILL
// GET /api/skills/:id
// ==========================================
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!isValidId(id)) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const skill = await Skill.findById(id)
      .select("_id user name level description followers createdAt updatedAt")
      .lean();

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (skill.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this skill.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill retrieved successfully.",
      data: {
        ...skill,
        followerCount: skill.followers?.length || 0,
      },
    });
  } catch (error) {
    console.error("Get Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skill.",
    });
  }
};

// ==========================================
// UPDATE SKILL
// PUT /api/skills/:id
// ==========================================
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const { name, level, description } = req.body;

    if (!isValidId(id)) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (skill.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this skill.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Skill name cannot be empty.",
        });
      }

      skill.name = name.trim();
    }

    if (level !== undefined) {
      if (
        !["Beginner", "Intermediate", "Advanced"].includes(level)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Skill level must be Beginner, Intermediate, or Advanced.",
        });
      }

      skill.level = level;
    }

    if (description !== undefined) {
      skill.description = description.trim();
    }

    await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("Update Skill Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have this skill.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update skill.",
    });
  }
};

// ==========================================
// DELETE SKILL
// DELETE /api/skills/:id
// ==========================================
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!isValidId(id)) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (skill.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this skill.",
      });
    }

    await SkillProof.deleteMany({
      skill: skill._id,
      user: userId,
    });

    await skill.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Skill and related proofs deleted successfully.",
      data: {
        skillId: id,
      },
    });
  } catch (error) {
    console.error("Delete Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill.",
    });
  }
};

// ==========================================
// FOLLOW SKILL - EXISTING FUNCTIONALITY
// ==========================================
export const followSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const alreadyFollowing = skill.followers.some(
      (followerId) =>
        followerId.toString() === userId.toString()
    );

    if (alreadyFollowing) {
      return res.status(409).json({
        success: false,
        message: "You are already following this skill.",
      });
    }

    skill.followers.push(userId);
    await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skill followed successfully.",
      data: {
        skillId: skill._id,
        followerCount: skill.followers.length,
      },
    });
  } catch (error) {
    console.error("Follow Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to follow skill.",
    });
  }
};

// ==========================================
// UNFOLLOW SKILL
// ==========================================
export const unfollowSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const followerIndex = skill.followers.findIndex(
      (followerId) =>
        followerId.toString() === userId.toString()
    );

    if (followerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "You are not following this skill.",
      });
    }

    skill.followers.splice(followerIndex, 1);
    await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skill removed successfully.",
      data: {
        skillId: skill._id,
        followerCount: skill.followers.length,
      },
    });
  } catch (error) {
    console.error("Remove Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove skill.",
    });
  }
};

// ==========================================
// GET USER SKILLS - EXISTING FUNCTIONALITY
// ==========================================
export const getUserSkills = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = await User.findById(id)
      .select("_id fullName")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const skills = await Skill.find({
      $or: [
        { user: id },
        { followers: id },
      ],
    })
      .select("_id user name level description createdAt")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "User skills retrieved successfully.",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
        },
        skills,
      },
    });
  } catch (error) {
    console.error("Get User Skills Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user skills.",
    });
  }
};
'@ | Set-Content src\controllers\skillController.js