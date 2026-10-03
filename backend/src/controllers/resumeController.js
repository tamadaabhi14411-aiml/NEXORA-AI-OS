import Resume from "../models/Resume.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

const getUserId = (req) => {
  return req.user?.id || req.user?._id;
};

const validateTarget = (req, res) => {
  const { company, role } = req.body;

  if (
    !company ||
    !company.trim() ||
    !role ||
    !role.trim()
  ) {
    res.status(400).json({
      success: false,
      message: "Company and role are required.",
    });

    return null;
  }

  return {
    company: company.trim(),
    role: role.trim(),
  };
};

// ==========================================
// ANALYZE RESUME TARGET
// ==========================================

export const analyzeResumeTarget = async (req, res) => {
  try {
    const target = validateTarget(req, res);

    if (!target) return;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    }).lean();

    const userSkills = Array.isArray(user.skills)
      ? user.skills
      : [];

    const matchedSkills = userSkills;

    const skillsToImprove = [];

    const recommendedSkills = [];

    const profileMatch = {
      overall: 0,
      skills: userSkills.length > 0 ? 100 : 0,
      projects: projects.length > 0 ? 100 : 0,
      experience: 0,
      education: 0,
    };

    profileMatch.overall = Math.round(
      (
        profileMatch.skills +
        profileMatch.projects +
        profileMatch.experience +
        profileMatch.education
      ) / 4
    );

    return res.status(200).json({
      success: true,
      company: target.company,
      role: target.role,
      source: "profile-based recommendation",
      matchedSkills,
      skillsToImprove,
      recommendedSkills,
      projects: projects.map((project) => ({
        id: project._id,
        title: project.title,
        description: project.description,
        skill: project.skill,
      })),
      profileMatch,
    });
  } catch (error) {
    console.error("Analyze Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume target.",
    });
  }
};

// ==========================================
// GENERATE + SAVE RESUME
// ==========================================

export const generateTargetedResume = async (req, res) => {
  try {
    const target = validateTarget(req, res);

    if (!target) return;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    }).lean();

    const skills = Array.isArray(user.skills)
      ? user.skills
      : [];

    const education = [];

    const experience = [];

    const achievements = [];

    const leadership = [];

    const projectData = projects.map((project) => ({
      title: project.title || "",
      description: project.description || "",
      skill: project.skill || "",
    }));

    const fullName = user.fullName || "User";

    const summary =
      `${fullName} is a student developing skills through ` +
      `projects and practical learning. ` +
      `Target role: ${target.role}.`;

    const resumeData = {
      user: userId,
      company: target.company,
      role: target.role,
      summary,
      skills,
      education,
      projects: projectData,
      experience,
      achievements,
      leadership,
      matchScore: skills.length > 0 || projects.length > 0
        ? 50
        : 0,
    };

    const resume = await Resume.create(resumeData);

    return res.status(201).json({
      success: true,
      message: "Resume generated and saved successfully.",
      resume: {
        id: resume._id,
        company: resume.company,
        role: resume.role,
        summary: resume.summary,
        skills: resume.skills,
        education: resume.education,
        projects: resume.projects,
        experience: resume.experience,
        achievements: resume.achievements,
        leadership: resume.leadership,
        matchScore: resume.matchScore,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error("Generate Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate resume.",
    });
  }
};

// ==========================================
// GET MY RESUMES
// ==========================================

export const getResumes = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const resumes = await Resume.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Resumes retrieved successfully.",
      data: resumes,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resumes.",
    });
  }
};

// ==========================================
// GET SINGLE RESUME
// ==========================================

export const getResumeById = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume retrieved successfully.",
      data: resume,
    });
  } catch (error) {
    console.error("Get Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resume.",
    });
  }
};