import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit3,
  FileText,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import profileService from "../../services/profileService";
import resumeService from "../../services/resumeService";
import { askPuterAI } from "../../services/puterAI";
import skillProofService from "../../services/skillProofService";

const COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "TCS",
  "Infosys",
  "Accenture",
  "Deloitte",
  "Other",
];

const ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "Data Analyst",
];

const EMPTY_ANALYSIS = {
  targetCompany: "",
  targetRole: "",
  skillMatch: 0,
  strongMatches: [],
  skillsToImprove: [],
  missingRecommendedSkills: [],
  recommendationType: "Profile-based recommendations",
  summary: "",
};

const EMPTY_RESUME = {
  name: "",
  contactInformation: "",
  professionalSummary: "",
  education: [],
  technicalSkills: [],
  projects: [],
  experience: [],
  achievements: [],
  communityLeadership: [],
  skillProof: [],
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
};

const cleanArray = (value) =>
  toArray(value)
    .map((item) => {
      if (typeof item === "string") return item.trim();

      if (item && typeof item === "object") {
        if (typeof item.name === "string" && item.name.trim()) {
          return item.name.trim();
        }

        if (typeof item.title === "string" && item.title.trim()) {
          return item.title.trim();
        }

        if (typeof item.description === "string" && item.description.trim()) {
          return item.description.trim();
        }
      }

      return "";
    })
    .filter(Boolean);

const getName = (profile) =>
  profile?.fullName ||
  profile?.name ||
  profile?.displayName ||
  profile?.user?.fullName ||
  profile?.user?.name ||
  "";

const getEmail = (profile) =>
  profile?.email ||
  profile?.user?.email ||
  "";

const normalizeProfile = (response) => {
  const user = response?.user || response?.data?.user || response?.data || response || {};

  return {
    ...user,
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    skills: cleanArray(user?.skills || user?.skillset),
    projects: toArray(user?.projects),
    achievements: cleanArray(user?.achievements),
    communities: cleanArray(user?.communities),
    experience: toArray(user?.experience || user?.experiences),
    education: toArray(user?.education),
    followers: Number(user?.followers || 0),
    username: user?.username || "",
    location: user?.location || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
  };
};

const normalizeSkillProofs = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const getSessionSkillPostItems = (post) => {
  if (!post || typeof post !== "object") return [];

  return [
    post.learning,
    post.built,
    post.skill,
    post.evidence,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
};

const parseAIJson = (text) => {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("AI returned an empty response.");
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("AI returned invalid JSON.");
  }
};

const normalizeAnalysis = (result, company, role) => {
  const data = result?.analysis || result?.data || result || {};

  return {
    targetCompany: data.targetCompany || company,
    targetRole: data.targetRole || role,
    skillMatch: Math.max(
      0,
      Math.min(100, Number(data.skillMatch || data.match || 0))
    ),
    strongMatches: cleanArray(
      data.strongMatches ||
        data.strong_matches ||
        data.matchedSkills ||
        []
    ),
    skillsToImprove: cleanArray(
      data.skillsToImprove ||
        data.skills_to_improve ||
        []
    ),
    missingRecommendedSkills: cleanArray(
      data.missingRecommendedSkills ||
        data.missingSkills ||
        data.recommendedSkills ||
        []
    ),
    recommendationType:
      data.recommendationType ||
      "Profile-based recommendations",
    summary:
      typeof data.summary === "string"
        ? data.summary.trim()
        : "",
  };
};

const normalizeResume = (result, profile, sessionSkillPost) => {
  const data = result?.resume || result?.data || result || {};

  const sessionItems = getSessionSkillPostItems(sessionSkillPost);

  const generatedSkillProof = cleanArray(
    data.skillProof ||
      data.skillProofs ||
      []
  );

  return {
    name: data.name || getName(profile),
    contactInformation:
      data.contactInformation ||
      data.contact ||
      getEmail(profile),
    professionalSummary:
      data.professionalSummary ||
      data.summary ||
      "",
    education: cleanArray(data.education || []),
    technicalSkills: cleanArray(
      data.technicalSkills ||
        data.skills ||
        []
    ),
    projects: cleanArray(data.projects || []),
    experience: cleanArray(
      data.experience ||
        data.experiences ||
        []
    ),
    achievements: cleanArray(data.achievements || []),
    communityLeadership: cleanArray(
      data.communityLeadership ||
        data.communities ||
        []
    ),
    skillProof:
      generatedSkillProof.length > 0
        ? generatedSkillProof
        : sessionItems,
  };
};

const getSafeProfilePromptData = (
  profile,
  skillProofs,
  sessionSkillPost
) => ({
  name: getName(profile),
  email: getEmail(profile),
  headline: profile?.headline || "",
  bio: profile?.bio || "",
  location: profile?.location || "",
  skills: cleanArray(profile?.skills),
  projects: profile?.projects || [],
  achievements: cleanArray(profile?.achievements),
  communities: cleanArray(profile?.communities),
  experience: profile?.experience || [],
  education: profile?.education || [],
  followers:
    typeof profile?.followers === "number"
      ? profile.followers
      : 0,
  skillProofs: skillProofs || [],
  sessionSkillPost: sessionSkillPost || null,
});

const getProjectNames = (projects) =>
  toArray(projects)
    .map((project) => {
      if (typeof project === "string") return project;

      return (
        project?.name ||
        project?.title ||
        project?.projectName ||
        ""
      );
    })
    .filter(Boolean);

const getExperienceItems = (experience) =>
  toArray(experience)
    .map((item) => {
      if (typeof item === "string") return item;

      const role = item?.role || item?.title || "";
      const company = item?.company || item?.organization || "";
      const description = item?.description || "";

      return [role, company, description]
        .filter(Boolean)
        .join(" - ");
    })
    .filter(Boolean);

const getEducationItems = (education) =>
  toArray(education)
    .map((item) => {
      if (typeof item === "string") return item;

      const degree = item?.degree || item?.course || "";
      const institution =
        item?.institution ||
        item?.college ||
        item?.university ||
        "";
      const year = item?.year || "";

      return [degree, institution, year]
        .filter(Boolean)
        .join(" - ");
    })
    .filter(Boolean);

const getProjectObjects = (projects) =>
  toArray(projects)
    .map((project) => {
      if (typeof project === "string") {
        return project;
      }

      return [
        project?.name || project?.title || "",
        project?.description || "",
        cleanArray(project?.technologies || project?.techStack || []).join(", "),
      ]
        .filter(Boolean)
        .join(" - ");
    })
    .filter(Boolean);

const friendlyError = (error, fallback) => {
  const status = error?.response?.status;

  if (status === 401 || status === 403) {
    return "Your session has expired. Please login again.";
  }

  if (status === 400) {
    return "The company or role information is invalid. Please check your selection.";
  }

  return fallback;
};

const buildAnalysisPrompt = (
  profile,
  skillProofs,
  sessionSkillPost,
  company,
  role
) => {
  const safeProfile = getSafeProfilePromptData(
    profile,
    skillProofs,
    sessionSkillPost
  );

  return `
You are the NEXORA AI Resume and Career Analysis assistant.

Analyze this user's REAL NEXORA profile for the target career.

Target company: ${company}
Target role: ${role}

IMPORTANT RULES:
1. Use ONLY information provided in the profile JSON.
2. Never invent skills, projects, employment, degrees, certifications, achievements, followers, or communities.
3. Never claim that a company requires a skill unless exact verified company requirements are provided.
4. If exact company requirements are not available, use the label:
   "Profile-based recommendations"
5. Keep actual profile skills separate from recommended skills.
6. The sessionSkillPost is user-provided session context. It may be used as evidence because the user explicitly entered it.
7. Do not turn a recommendation into an actual skill.
8. Do not create fake company data.
9. If information is missing, keep the corresponding list empty.

Return ONLY valid JSON.

Required JSON shape:
{
  "targetCompany": "",
  "targetRole": "",
  "skillMatch": 0,
  "strongMatches": [],
  "skillsToImprove": [],
  "missingRecommendedSkills": [],
  "recommendationType": "Profile-based recommendations",
  "summary": ""
}

Profile JSON:
${JSON.stringify(safeProfile, null, 2)}
`;
};

const buildResumePrompt = (
  profile,
  skillProofs,
  sessionSkillPost,
  company,
  role
) => {
  const safeProfile = getSafeProfilePromptData(
    profile,
    skillProofs,
    sessionSkillPost
  );

  return `
You are the NEXORA AI Resume Builder.

Create an ATS-friendly one-page resume for:

Company target: ${company}
Role target: ${role}

Use ONLY verified information supplied in the profile JSON.

IMPORTANT RULES:
1. Never fabricate a company, employment, degree, certification, project, achievement, community, or skill.
2. Never invent dates, percentages, job titles, technologies, responsibilities, awards, or education.
3. The sessionSkillPost is user-provided information and can be used as resume evidence.
4. Do not convert AI recommendations into actual user skills.
5. Do not claim the user worked for the target company.
6. If information is missing, use an empty string or empty array.
7. Keep the resume ATS-friendly and concise.
8. Return only valid JSON.

Required JSON shape:
{
  "name": "",
  "contactInformation": "",
  "professionalSummary": "",
  "education": [],
  "technicalSkills": [],
  "projects": [],
  "experience": [],
  "achievements": [],
  "communityLeadership": [],
  "skillProof": []
}

Profile JSON:
${JSON.stringify(safeProfile, null, 2)}
`;
};

const ResumeDocument = ({
  resume,
  company,
  role,
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-900 shadow-sm">
    <div className="border-b border-gray-300 pb-4">
      <h2 className="text-2xl font-bold">
        {resume.name || "Your Name"}
      </h2>

      {resume.contactInformation && (
        <p className="mt-1 text-sm text-gray-600">
          {resume.contactInformation}
        </p>
      )}

      {(company || role) && (
        <p className="mt-2 text-xs font-medium text-gray-500">
          Target: {[company, role].filter(Boolean).join(" • ")}
        </p>
      )}
    </div>

    <ResumeSection
      title="Professional Summary"
      value={resume.professionalSummary}
    />

    <ResumeListSection
      title="Education"
      items={resume.education}
    />

    <ResumeListSection
      title="Technical Skills"
      items={resume.technicalSkills}
    />

    <ResumeListSection
      title="Projects"
      items={resume.projects}
    />

    <ResumeListSection
      title="Experience"
      items={resume.experience}
    />

    <ResumeListSection
      title="Achievements"
      items={resume.achievements}
    />

    <ResumeListSection
      title="Community / Leadership"
      items={resume.communityLeadership}
    />

    <ResumeListSection
      title="Skill Proof"
      items={resume.skillProof}
    />
  </div>
);

const ResumeSection = ({ title, value }) => {
  if (!value) return null;

  return (
    <section className="mt-6">
      <h3 className="border-b border-gray-200 pb-1 text-sm font-bold uppercase tracking-wide">
        {title}
      </h3>

      <p className="mt-2 whitespace-pre-line text-sm leading-6">
        {value}
      </p>
    </section>
  );
};

const ResumeListSection = ({ title, items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="mt-6">
      <h3 className="border-b border-gray-200 pb-1 text-sm font-bold uppercase tracking-wide">
        {title}
      </h3>

      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

const ResumeAI = () => {
  const [profile, setProfile] = useState(null);
  const [skillProofs, setSkillProofs] = useState([]);
  const [sessionSkillPost, setSessionSkillPost] = useState(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");

  const [analysis, setAnalysis] = useState(EMPTY_ANALYSIS);
  const [resume, setResume] = useState(EMPTY_RESUME);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [profileError, setProfileError] = useState("");
  const [actionError, setActionError] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedRole = customRole.trim() || role;

  const projectNames = useMemo(
    () => getProjectNames(profile?.projects),
    [profile]
  );

  const experienceItems = useMemo(
    () => getExperienceItems(profile?.experience),
    [profile]
  );

  const educationItems = useMemo(
    () => getEducationItems(profile?.education),
    [profile]
  );

  const sessionSkillPostItems = useMemo(
    () => getSessionSkillPostItems(sessionSkillPost),
    [sessionSkillPost]
  );

  const hasUsefulProfileData =
    Boolean(profile?.fullName) ||
    Boolean(profile?.email) ||
    (profile?.skills?.length || 0) > 0 ||
    projectNames.length > 0 ||
    experienceItems.length > 0 ||
    educationItems.length > 0 ||
    (profile?.achievements?.length || 0) > 0 ||
    (profile?.communities?.length || 0) > 0 ||
    skillProofs.length > 0 ||
    sessionSkillPostItems.length > 0;

  useEffect(() => {
    loadProfile();

    try {
      const raw = localStorage.getItem("nexora_skill_post");

      if (raw) {
        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed === "object") {
          setSessionSkillPost(parsed);
        }
      }
    } catch (error) {
      console.warn("Unable to load session skill post:", error);
    }
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError("");

      const response = await profileService.getProfile();
      const normalized = normalizeProfile(response);

      setProfile(normalized);

      try {
        const proofs = await skillProofService.getMySkillProofs();

        if (Array.isArray(proofs)) {
          setSkillProofs(normalizeSkillProofs(proofs));
        } else if (Array.isArray(proofs?.skillProofs)) {
          setSkillProofs(normalizeSkillProofs(proofs.skillProofs));
        } else {
          setSkillProofs([]);
        }
      } catch (proofError) {
        setSkillProofs([]);
        console.warn("Skill proof API unavailable:", proofError);
      }
    } catch (error) {
      setProfile(
        null
      );

      setProfileError(
        friendlyError(
          error,
          "Unable to load your profile from NEXORA. Please try again."
        )
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setActionError("");
    setSaved(false);

    if (!company) {
      setActionError(
        "Please select a target company before analysis."
      );
      return;
    }

    if (!selectedRole) {
      setActionError(
        "Please select a target role or enter a custom role."
      );
      return;
    }

    if (!profile) {
      setActionError(
        "Your profile could not be loaded. Please try again."
      );
      return;
    }

    if (!hasUsefulProfileData) {
      setActionError(
        "Your profile does not contain enough information for analysis. Add profile information first."
      );
      return;
    }

    setLoading(true);

    const prompt = buildAnalysisPrompt(
      profile,
      skillProofs,
      sessionSkillPost,
      company,
      selectedRole
    );

    try {
      try {
        const backendResponse =
          await resumeService.analyzeResume(
            company,
            selectedRole
          );

        const backendAnalysis =
          normalizeAnalysis(
            backendResponse,
            company,
            selectedRole
          );

        setAnalysis(backendAnalysis);
        setLoading(false);
        return;
      } catch (backendError) {
        console.warn(
          "Resume analysis backend unavailable. Falling back to Puter AI.",
          backendError
        );
      }

      const aiResponse = await askPuterAI(prompt);
      const parsed = parseAIJson(aiResponse);

      setAnalysis(
        normalizeAnalysis(
          parsed,
          company,
          selectedRole
        )
      );
    } catch (error) {
      setActionError(
        "AI analysis is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    setActionError("");
    setSaved(false);

    if (!company) {
      setActionError(
        "Please select a target company before generating your resume."
      );
      return;
    }

    if (!selectedRole) {
      setActionError(
        "Please select a target role or enter a custom role."
      );
      return;
    }

    if (!profile) {
      setActionError(
        "Your profile could not be loaded. Please try again."
      );
      return;
    }

    if (!hasUsefulProfileData) {
      setActionError(
        "Your profile does not contain enough information for resume generation. Add profile information first."
      );
      return;
    }

    setGenerating(true);

    const prompt = buildResumePrompt(
      profile,
      skillProofs,
      sessionSkillPost,
      company,
      selectedRole
    );

    try {
      try {
        const backendResponse =
          await resumeService.generateResume(
            company,
            selectedRole
          );

        const backendResume =
          normalizeResume(
            backendResponse,
            profile,
            sessionSkillPost
          );

        setResume(backendResume);
        setPreviewOpen(true);
        setGenerating(false);
        return;
      } catch (backendError) {
        console.warn(
          "Resume generation backend unavailable. Falling back to Puter AI.",
          backendError
        );
      }

      const aiResponse = await askPuterAI(prompt);
      const parsed = parseAIJson(aiResponse);

      const generatedResume = normalizeResume(
        parsed,
        profile,
        sessionSkillPost
      );

      setResume(generatedResume);
      setPreviewOpen(true);
    } catch (error) {
      setActionError(
        "AI resume generation is temporarily unavailable. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerateResume();
  };

  const handleSaveResume = () => {
    try {
      localStorage.setItem(
        "nexora_ai_resume",
        JSON.stringify({
          resume,
          company,
          role: selectedRole,
          savedAt: new Date().toISOString(),
        })
      );

      setSaved(true);
      setActionError("");
    } catch (error) {
      setActionError(
        "Unable to save the resume on this device."
      );
    }
  };

  const handleDownload = () => {
    try {
      const resumeText = [
        resume.name,
        resume.contactInformation,
        "",
        "PROFESSIONAL SUMMARY",
        resume.professionalSummary,
        "",
        "EDUCATION",
        ...resume.education,
        "",
        "TECHNICAL SKILLS",
        ...resume.technicalSkills,
        "",
        "PROJECTS",
        ...resume.projects,
        "",
        "EXPERIENCE",
        ...resume.experience,
        "",
        "ACHIEVEMENTS",
        ...resume.achievements,
        "",
        "COMMUNITY / LEADERSHIP",
        ...resume.communityLeadership,
        "",
        "SKILL PROOF",
        ...resume.skillProof,
      ]
        .filter((item) => item !== null && item !== undefined)
        .join("\n");

      const blob = new Blob([resumeText], {
        type: "text/plain;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "nexora-ai-resume.txt";
      anchor.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      setActionError(
        "Resume export is unavailable."
      );
    }
  };

  const updateResumeField = (field, value) => {
    setResume((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const getCareerMatch = () => {
    const skillsScore =
      profile?.skills?.length ||
      sessionSkillPost?.skill
        ? 100
        : 0;

    const projectsScore =
      projectNames.length > 0 ||
      sessionSkillPost?.built
        ? 100
        : 0;

    const experienceScore =
      experienceItems.length > 0
        ? 100
        : 0;

    const educationScore =
      educationItems.length > 0
        ? 100
        : 0;

    return {
      skills: skillsScore,
      projects: projectsScore,
      experience: experienceScore,
      education: educationScore,
    };
  };

  const careerMatch = getCareerMatch();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  AI Resume Builder
                </h1>

                <p className="mt-1 text-gray-400">
                  Build a resume tailored to the company and role you want.
                </p>
              </div>
            </div>
          </div>

          {profileError && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />

                <div>
                  <p className="font-medium text-red-300">
                    {profileError}
                  </p>

                  <button
                    type="button"
                    onClick={loadProfile}
                    className="mt-2 text-sm text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {actionError && (
            <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-400" />

                <p className="font-medium text-yellow-200">
                  {actionError}
                </p>
              </div>
            </div>
          )}

          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-400" />

              <div>
                <h2 className="text-xl font-semibold">
                  Target Career
                </h2>

                <p className="text-sm text-gray-400">
                  Choose the company and role you are targeting.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Target Company
                </label>

                <div className="relative">
                  <select
                    value={company}
                    onChange={(event) =>
                      setCompany(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black px-4 py-3 pr-10 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select company
                    </option>

                    {COMPANIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Target Role
                </label>

                <div className="relative">
                  <select
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black px-4 py-3 pr-10 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select role
                    </option>

                    {ROLES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>

                <input
                  type="text"
                  value={customRole}
                  onChange={(event) =>
                    setCustomRole(event.target.value)
                  }
                  placeholder="Or enter a custom role"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing your skills and projects...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Analyze My Profile
                </>
              )}
            </button>
          </section>

          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-blue-400" />

              <div>
                <h2 className="text-xl font-semibold">
                  Your Profile
                </h2>

                <p className="text-sm text-gray-400">
                  Information currently available to NEXORA.
                </p>
              </div>
            </div>

            {profileLoading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading profile...
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileItem
                  label="Display Name"
                  value={getName(profile) || "Not available"}
                  strong
                />

                <ProfileItem
                  label="Followers"
                  value={String(profile?.followers || 0)}
                  strong
                />

                <ProfileItem
                  label="Skills"
                  value={
                    profile?.skills?.length
                      ? profile.skills.join(", ")
                      : "No skills added yet"
                  }
                />

                <ProfileItem
                  label="Projects"
                  value={
                    projectNames.length
                      ? projectNames.join(", ")
                      : "No projects added yet"
                  }
                />

                <ProfileItem
                  label="Achievements"
                  value={
                    profile?.achievements?.length
                      ? profile.achievements.join(", ")
                      : "No achievements added yet"
                  }
                />

                <ProfileItem
                  label="Communities"
                  value={
                    profile?.communities?.length
                      ? profile.communities.join(", ")
                      : "No communities added yet"
                  }
                />

                <ProfileItem
                  label="Experience"
                  value={
                    experienceItems.length
                      ? experienceItems.join(", ")
                      : "No experience added yet"
                  }
                />

                <ProfileItem
                  label="Skill proof"
                  value={
                    skillProofs.length
                      ? skillProofs
                          .map(
                            (item) =>
                              item?.title ||
                              item?.name ||
                              item?.skill ||
                              ""
                          )
                          .filter(Boolean)
                          .join(", ")
                      : "No skill proof available"
                  }
                />

                <div className="md:col-span-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />

                    <h3 className="font-semibold">
                      Skill Post
                    </h3>
                  </div>

                  {sessionSkillPostItems.length > 0 ? (
                    <div className="space-y-3 text-sm">
                      {sessionSkillPost?.learning && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Learning
                          </p>

                          <p className="mt-1 text-gray-200">
                            {sessionSkillPost.learning}
                          </p>
                        </div>
                      )}

                      {sessionSkillPost?.built && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Built
                          </p>

                          <p className="mt-1 text-gray-200">
                            {sessionSkillPost.built}
                          </p>
                        </div>
                      )}

                      {sessionSkillPost?.skill && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Skill
                          </p>

                          <p className="mt-1 text-gray-200">
                            {sessionSkillPost.skill}
                          </p>
                        </div>
                      )}

                      {sessionSkillPost?.evidence && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Evidence
                          </p>

                          <p className="mt-1 text-gray-200">
                            {sessionSkillPost.evidence}
                          </p>
                        </div>
                      )}

                      <p className="pt-1 text-xs text-blue-300">
                        Session-only data • Not stored by the backend.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skill post available
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Skill Matching
              </h2>

              <p className="text-sm text-gray-400">
                Based on the information available in your profile.
              </p>
            </div>

            {!analysis.targetCompany ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-gray-500">
                Select a company and role, then analyze your profile.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <MatchCard
                    label="Target Company"
                    value={analysis.targetCompany}
                  />

                  <MatchCard
                    label="Target Role"
                    value={analysis.targetRole}
                  />

                  <MatchCard
                    label="Skill Match"
                    value={`${analysis.skillMatch}%`}
                    accent
                  />
                </div>

                {analysis.summary && (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-gray-300">
                    {analysis.summary}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-3">
                  <ListCard
                    title="Strong Matches"
                    items={analysis.strongMatches}
                    icon={CheckCircle2}
                  />

                  <ListCard
                    title="Skills to Improve"
                    items={analysis.skillsToImprove}
                    icon={RefreshCw}
                  />

                  <ListCard
                    title="Missing/Recommended Skills"
                    items={analysis.missingRecommendedSkills}
                    icon={Target}
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Recommendation source
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-200">
                    {analysis.recommendationType ||
                      "Profile-based recommendations"}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                NEXORA profile match estimate
              </h2>

              <p className="text-sm text-gray-400">
                This is not an official company score.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PercentCard
                label="Skills"
                value={careerMatch.skills}
              />

              <PercentCard
                label="Projects"
                value={careerMatch.projects}
              />

              <PercentCard
                label="Experience"
                value={careerMatch.experience}
              />

              <PercentCard
                label="Education"
                value={careerMatch.education}
              />
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Generate Your Resume
              </h2>

              <p className="text-sm text-gray-400">
                Generate an ATS-friendly one-page resume using only verified information from your NEXORA profile.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateResume}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Resume
                </>
              )}
            </button>
          </section>

          {(resume.name || resume.professionalSummary || resume.technicalSkills.length > 0) && (
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Resume Preview
                  </h2>

                  <p className="text-sm text-gray-400">
                    ATS-friendly one-page resume preview.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewOpen((current) => !current)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                  >
                    {previewOpen ? (
                      <>
                        <X className="h-4 w-4" />
                        Close
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditMode((current) => !current)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={generating}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/5 disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveResume}
                    className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300 hover:bg-green-500/20"
                  >
                    <Save className="h-4 w-4" />
                    Save Resume
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              {saved && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Resume saved successfully on this device.
                </div>
              )}

              {editMode && (
                <div className="mb-6 space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Name
                    </label>

                    <input
                      type="text"
                      value={resume.name}
                      onChange={(event) =>
                        updateResumeField(
                          "name",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Contact Information
                    </label>

                    <input
                      type="text"
                      value={resume.contactInformation}
                      onChange={(event) =>
                        updateResumeField(
                          "contactInformation",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Professional Summary
                    </label>

                    <textarea
                      rows={5}
                      value={resume.professionalSummary}
                      onChange={(event) =>
                        updateResumeField(
                          "professionalSummary",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {previewOpen && (
                <ResumeDocument
                  resume={resume}
                  company={company}
                  role={selectedRole}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const ProfileItem = ({
  label,
  value,
  strong = false,
}) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <p
      className={`mt-2 text-sm ${
        strong
          ? "font-semibold text-white"
          : "text-gray-300"
      }`}
    >
      {value}
    </p>
  </div>
);

const MatchCard = ({
  label,
  value,
  accent = false,
}) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <p
      className={`mt-2 text-lg font-semibold ${
        accent ? "text-blue-400" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

const PercentCard = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-5">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="text-xl font-bold text-white">
        {value}%
      </span>
    </div>

    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-blue-500 transition-all"
        style={{
          width: `${Math.max(
            0,
            Math.min(100, value)
          )}%`,
        }}
      />
    </div>
  </div>
);

const ListCard = ({
  title,
  items,
  icon: Icon,
}) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-blue-400" />

      <h3 className="text-sm font-semibold">
        {title}
      </h3>
    </div>

    {items?.length ? (
      <ul className="space-y-2 text-sm text-gray-300">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="rounded-lg bg-white/[0.03] px-3 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500">
        No data available.
      </p>
    )}
  </div>
);

export default ResumeAI;


