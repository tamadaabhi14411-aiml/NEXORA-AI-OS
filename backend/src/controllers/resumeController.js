import User from "../models/User.js";
import { getMemory } from "../services/memoryService.js";
import { generateAIResponse } from "../services/aiService.js";

// ============================================
// Helper: Build User Career Evidence
// ============================================

const buildProfileData = (user, memory) => {
  return {
    profile: {
      name: memory?.profile?.name || user.fullName || "",
      email: memory?.profile?.email || user.email || "",
      college: memory?.profile?.college || "",
      branch: memory?.profile?.branch || "",
      year: memory?.profile?.year || "",
    },

    career: memory?.career || {},

    skills: Array.isArray(memory?.skills)
      ? memory.skills
      : [],

    projects: Array.isArray(memory?.projects)
      ? memory.projects
      : [],

    // Not currently stored in Memory model
    achievements: [],
    education: [],
    experience: [],
    community: [],
  };
};

// ============================================
// Helper: Check Career Evidence
// ============================================

const hasCareerEvidence = (profileData) => {
  const profile = profileData.profile || {};
  const career = profileData.career || {};

  return (
    Boolean(profile.college) ||
    Boolean(profile.branch) ||
    Boolean(profile.year) ||
    Boolean(career.goal) ||
    Boolean(career.targetYear) ||
    Boolean(career.currentLevel) ||
    profileData.skills.length > 0 ||
    profileData.projects.length > 0 ||
    profileData.achievements.length > 0 ||
    profileData.education.length > 0 ||
    profileData.experience.length > 0 ||
    profileData.community.length > 0
  );
};

// ============================================
// Helper: AI Error Handler
// ============================================

const handleAIError = (error, res, operation) => {
  console.error(`${operation} Error:`, error);

  const errorMessage = String(
    error?.message ||
      error?.error?.message ||
      ""
  ).toLowerCase();

  if (
    error?.status === 429 ||
    error?.response?.status === 429 ||
    errorMessage.includes("rate limit") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("too many requests")
  ) {
    return res.status(429).json({
      success: false,
      message:
        "AI service quota or rate limit reached. Please try again later.",
    });
  }

  return res.status(500).json({
    success: false,
    message: `Failed to ${operation.toLowerCase()}.`,
  });
};

// ============================================
// TASK 1
// Targeted Resume / Profile Match Analysis
// ============================================

export const analyzeResumeTarget = async (req, res) => {
  try {
    const { company, role } = req.body;

    // ----------------------------------------
    // Validate input
    // ----------------------------------------

    if (
      !company ||
      typeof company !== "string" ||
      !company.trim() ||
      !role ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Target company and role are required.",
      });
    }

    const targetCompany = company.trim();
    const targetRole = role.trim();

    // ----------------------------------------
    // Get authenticated user
    // ----------------------------------------

    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ----------------------------------------
    // Get authenticated user's memory
    // ----------------------------------------

    const memory = await getMemory(req.user._id);

    const profileData = buildProfileData(
      user,
      memory
    );

    // ----------------------------------------
    // Check career data
    // ----------------------------------------

    if (!hasCareerEvidence(profileData)) {
      return res.status(400).json({
        success: false,
        message:
          "Career profile data is empty. Please add your skills, projects, education, experience, or career information first.",
      });
    }

    // ----------------------------------------
    // AI Analysis Prompt
    // ----------------------------------------

    const systemPrompt = `
You are Resume AI of NEXORA AI OS.

Analyze the user's EXISTING career evidence
against the requested target company and target role.

STRICT RULES:

1. Use ONLY information present in USER CAREER DATA.
2. NEVER invent skills.
3. NEVER invent projects.
4. NEVER invent experience.
5. NEVER invent achievements.
6. NEVER invent education.
7. NEVER invent certifications.
8. NEVER invent technologies.
9. NEVER claim the user worked for the target company.
10. Do not fabricate company-specific requirements.
11. Do not fabricate a job description.
12. Skill gaps must be reasonable for the requested role.
13. Recommendations must be based on the user's actual evidence.
14. Match score must be between 0 and 100.
15. Calculate matchScore based on how strongly the user's
    existing skills, projects, career information and other
    supplied evidence align with the requested role.
16. Do not give a high score simply because information is missing.
17. If evidence is limited, reduce the match score accordingly.
18. Return ONLY valid JSON.
19. Do NOT use markdown code fences.

Return exactly this structure:

{
  "target": {
    "company": "",
    "role": ""
  },
  "matchScore": 0,
  "relevantStrengths": [],
  "skillGaps": [],
  "projectRelevance": [],
  "experienceRelevance": [],
  "recommendations": []
}
`;

    const userPrompt = `
TARGET COMPANY:
${targetCompany}

TARGET ROLE:
${targetRole}

USER CAREER DATA:
${JSON.stringify(profileData, null, 2)}
`;

    // ----------------------------------------
    // Call AI
    // ----------------------------------------

    let aiResponse;

    try {
      aiResponse = await generateAIResponse(
        systemPrompt,
        userPrompt
      );
    } catch (error) {
      return handleAIError(
        error,
        res,
        "analyze resume target"
      );
    }

    // ----------------------------------------
    // Parse AI JSON
    // ----------------------------------------

    let analysis;

    try {
      analysis = JSON.parse(aiResponse);
    } catch (error) {
      console.error(
        "Resume Analysis JSON Error:",
        error
      );

      return res.status(502).json({
        success: false,
        message:
          "AI returned an invalid analysis response.",
      });
    }

    // ----------------------------------------
    // Validate matchScore
    // ----------------------------------------

    const numericScore = Number(
      analysis.matchScore
    );

    if (
      !Number.isFinite(numericScore) ||
      numericScore < 0 ||
      numericScore > 100
    ) {
      return res.status(502).json({
        success: false,
        message:
          "AI returned an invalid match score.",
      });
    }

    // Normalize response
    analysis.matchScore = Math.round(
      numericScore
    );

    analysis.target = {
      company: targetCompany,
      role: targetRole,
    };

    // ----------------------------------------
    // Return Analysis
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Resume target analysis completed successfully.",
      data: analysis,
    });
  } catch (error) {
    return handleAIError(
      error,
      res,
      "analyze resume target"
    );
  }
};

// ============================================
// TASK 2
// Targeted Resume Generation
// ============================================

export const generateTargetedResume = async (
  req,
  res
) => {
  try {
    const { company, role } = req.body;

    // ----------------------------------------
    // Validate input
    // ----------------------------------------

    if (
      !company ||
      typeof company !== "string" ||
      !company.trim() ||
      !role ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Target company and role are required.",
      });
    }

    const targetCompany = company.trim();
    const targetRole = role.trim();

    // ----------------------------------------
    // Get authenticated user
    // ----------------------------------------

    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ----------------------------------------
    // Get authenticated user's memory
    // ----------------------------------------

    const memory = await getMemory(req.user._id);

    const profileData = buildProfileData(
      user,
      memory
    );

    // ----------------------------------------
    // Check career data
    // ----------------------------------------

    if (!hasCareerEvidence(profileData)) {
      return res.status(400).json({
        success: false,
        message:
          "Career profile data is empty. Please add your skills, projects, education, experience, or career information first.",
      });
    }

    // ----------------------------------------
    // Resume Generation Prompt
    // ----------------------------------------

    const systemPrompt = `
You are Resume AI of NEXORA AI OS.

Generate targeted resume content for the supplied
target company and target role.

STRICT RULES:

1. Use ONLY the user's existing evidence.
2. NEVER invent experience.
3. NEVER invent projects.
4. NEVER invent skills.
5. NEVER invent achievements.
6. NEVER invent education.
7. NEVER invent certifications.
8. NEVER invent technologies.
9. NEVER claim the user worked for the target company.
10. Do not create fake dates.
11. Do not create fake employers.
12. Do not create fake degrees.
13. Do not create fake projects.
14. Do not create fake achievements.
15. Do not create fake qualifications.
16. If a section has no evidence, return an empty array.
17. Keep content professional and ATS-friendly.
18. Preserve the truth of the user's existing evidence.
19. Do NOT use markdown code fences.
20. Return ONLY valid JSON.

Return exactly this structure:

{
  "target": {
    "company": "",
    "role": ""
  },
  "summary": "",
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "achievements": []
}
`;

    const userPrompt = `
TARGET COMPANY:
${targetCompany}

TARGET ROLE:
${targetRole}

USER CAREER DATA:
${JSON.stringify(profileData, null, 2)}
`;

    // ----------------------------------------
    // Call AI
    // ----------------------------------------

    let aiResponse;

    try {
      aiResponse = await generateAIResponse(
        systemPrompt,
        userPrompt
      );
    } catch (error) {
      return handleAIError(
        error,
        res,
        "generate targeted resume"
      );
    }

    // ----------------------------------------
    // Parse JSON
    // ----------------------------------------

    let resume;

    try {
      resume = JSON.parse(aiResponse);
    } catch (error) {
      console.error(
        "Resume Generation JSON Error:",
        error
      );

      return res.status(502).json({
        success: false,
        message:
          "AI returned an invalid resume response.",
      });
    }

    // Force requested target values
    resume.target = {
      company: targetCompany,
      role: targetRole,
    };

    // ----------------------------------------
    // Return Resume
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Targeted resume generated successfully.",
      data: resume,
    });
  } catch (error) {
    return handleAIError(
      error,
      res,
      "generate targeted resume"
    );
  }
};