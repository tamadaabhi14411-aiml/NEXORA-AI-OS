import Skill from "../models/Skill.js";
import User from "../models/User.js";

/*
============================================================
GET ALL SKILLS
GET /api/skills
============================================================
*/
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Skills retrieved successfully.",
      data: skills,
    });
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skills.",
    });
  }
};

/*
============================================================
GET SINGLE SKILL
GET /api/skills/:id
============================================================
*/
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill retrieved successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("GET SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve skill.",
    });
  }
};

/*
============================================================
CREATE SKILL
POST /api/skills
============================================================
*/
export const createSkill = async (req, res) => {
  try {
    const { name, level, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required.",
      });
    }

    const existingSkill = await Skill.findOne({
      name: name.trim(),
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists.",
        data: existingSkill,
      });
    }

    const skill = await Skill.create({
      name: name.trim(),
      level: level || "Beginner",
      description: description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("CREATE SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create skill.",
      error: error.message,
    });
  }
};

/*
============================================================
UPDATE SKILL
PUT /api/skills/:id
============================================================
*/
export const updateSkill = async (req, res) => {
  try {
    const { name, level, description } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (name !== undefined) {
      skill.name = name.trim();
    }

    if (level !== undefined) {
      skill.level = level;
    }

    if (description !== undefined) {
      skill.description = description;
    }

    await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("UPDATE SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skill.",
      error: error.message,
    });
  }
};

/*
============================================================
DELETE SKILL
DELETE /api/skills/:id
============================================================
*/
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill.",
      error: error.message,
    });
  }
};

/*
============================================================
GET USER SKILLS
GET /api/users/skills
============================================================
*/
export const getUserSkills = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).populate("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User skills retrieved successfully.",
      data: user.skills || [],
    });
  } catch (error) {
    console.error("GET USER SKILLS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user skills.",
      error: error.message,
    });
  }
};

/*
============================================================
ADD SKILL TO USER
POST /api/users/skills/:skillId
============================================================
*/
export const addUserSkill = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { skillId } = req.params;

    const user = await User.findById(userId);
    const skill = await Skill.findById(skillId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    if (!user.skills) {
      user.skills = [];
    }

    const alreadyAdded = user.skills.some(
      (id) => id.toString() === skillId
    );

    if (alreadyAdded) {
      return res.status(409).json({
        success: false,
        message: "Skill already added to user.",
      });
    }

    user.skills.push(skillId);

    await user.save();

    const updatedUser = await User.findById(userId).populate("skills");

    return res.status(200).json({
      success: true,
      message: "Skill added to user successfully.",
      data: updatedUser.skills,
    });
  } catch (error) {
    console.error("ADD USER SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add skill to user.",
      error: error.message,
    });
  }
};

/*
============================================================
REMOVE SKILL FROM USER
DELETE /api/users/skills/:skillId
============================================================
*/
export const removeUserSkill = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { skillId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.skills = (user.skills || []).filter(
      (id) => id.toString() !== skillId
    );

    await user.save();

    const updatedUser = await User.findById(userId).populate("skills");

    return res.status(200).json({
      success: true,
      message: "Skill removed from user successfully.",
      data: updatedUser.skills,
    });
  } catch (error) {
    console.error("REMOVE USER SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove skill from user.",
      error: error.message,
    });
  }
};