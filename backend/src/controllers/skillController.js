import Skill from "../models/Skill.js";
import User from "../models/User.js";

// ===============================
// CREATE / ADD SKILL
// ===============================

export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required.",
      });
    }

    const skillName = name.trim();

    const existingSkill = await Skill.findOne({
      name: { $regex: `^${skillName}$`, $options: "i" },
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists.",
        data: existingSkill,
      });
    }

    const skill = await Skill.create({
      name: skillName,
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("Create Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create skill.",
    });
  }
};

// ===============================
// GET ALL / SEARCH SKILLS
// ===============================

export const getSkills = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {};

    if (search && search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skills = await Skill.find(filter)
      .select("_id name followers createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    const data = skills.map((skill) => ({
      _id: skill._id,
      name: skill.name,
      followerCount: skill.followers.length,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
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

// ===============================
// GET SINGLE SKILL
// ===============================

export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id)
      .select("_id name followers createdAt updatedAt")
      .lean();

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill retrieved successfully.",
      data: {
        _id: skill._id,
        name: skill.name,
        followerCount: skill.followers.length,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
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

// ===============================
// FOLLOW SKILL
// ===============================

export const followSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

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

// ===============================
// GET USER SKILLS
// ===============================

export const getUserSkills = async (req, res) => {
  try {
    const { id } = req.params;

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
      followers: id,
    })
      .select("_id name createdAt")
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
// REMOVE / UNFOLLOW SKILL
export const unfollowSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

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