import { useEffect, useState } from "react";
import {
  User,
  Code2,
  FolderKanban,
  GraduationCap,
  Trophy,
  Briefcase,
  Users,
  Target,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import profileService from "../../services/profileService";
import resumeService from "../../services/resumeService";

const companies = [
  { value: "Google", label: "Google" },
  { value: "Microsoft", label: "Microsoft" },
  { value: "Amazon", label: "Amazon" },
  { value: "Apple", label: "Apple" },
  { value: "Meta", label: "Meta" },
];

const roles = [
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Data Scientist", label: "Data Scientist" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "ML Engineer", label: "ML Engineer" },
];

function ResumeAI() {
  const [profileData, setProfileData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");

  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  // ---------------------------------------
  // LOAD USER PROFILE
  // ---------------------------------------

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await profileService.getProfile();

      console.log("Profile response:", response);

      if (!response?.success || !response?.data) {
        throw new Error("Invalid profile response.");
      }

      setProfileData(response.data);
    } catch (err) {
      console.error("Resume AI profile error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.request) {
        setError("Unable to connect to the profile backend.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ---------------------------------------
  // ANALYZE PROFILE
  // ---------------------------------------

  const handleAnalyzeProfile = async () => {
    if (!company || !role) {
      setAnalysisError("Please select both a company and a role.");
      return;
    }

    try {
      setAnalysisLoading(true);
      setAnalysisError("");
      setAnalysis(null);

      console.log("Sending Resume AI analysis request:", {
        company,
        role,
      });

      const response = await resumeService.analyzeResume(company, role);

      console.log("Resume analysis response:", response);

      if (!response?.success || !response?.data) {
        throw new Error("Invalid resume analysis response.");
      }

      setAnalysis(response.data);
    } catch (err) {
      console.error("Resume analysis error:", err);

      if (err.response?.status === 400) {
        setAnalysisError(
          err.response?.data?.message ||
            "Career profile data is empty. Please add your skills, projects, education, experience, or career information first."
        );
      } else if (err.response?.status === 401) {
        setAnalysisError(
          "Your session has expired. Please login again."
        );
      } else if (err.request) {
        setAnalysisError(
          "Unable to connect to the Resume AI backend."
        );
      } else {
        setAnalysisError(
          err.response?.data?.message ||
            err.message ||
            "Unable to analyze your profile."
        );
      }
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ---------------------------------------
  // GENERATE RESUME
  // ---------------------------------------

  const handleGenerateResume = async () => {
    if (!company || !role) {
      setResumeError("Please select both a company and a role.");
      return;
    }

    try {
      setResumeLoading(true);
      setResumeError("");
      setResume(null);

      console.log("Sending Resume generation request:", {
        company,
        role,
      });

      const response = await resumeService.generateResume(
        company,
        role
      );

      console.log("Resume generation response:", response);

      if (!response?.success || !response?.data) {
        throw new Error("Invalid resume generation response.");
      }

      setResume(response.data);
    } catch (err) {
      console.error("Resume generation error:", err);

      if (err.response?.status === 400) {
        setResumeError(
          err.response?.data?.message ||
            "Career profile data is empty. Please add your career information first."
        );
      } else if (err.response?.status === 401) {
        setResumeError(
          "Your session has expired. Please login again."
        );
      } else if (err.request) {
        setResumeError(
          "Unable to connect to the Resume AI backend."
        );
      } else {
        setResumeError(
          err.response?.data?.message ||
            err.message ||
            "Unable to generate your resume."
        );
      }
    } finally {
      setResumeLoading(false);
    }
  };

  // ---------------------------------------
  // PROFILE VALUES
  // ---------------------------------------

  const user = profileData?.user || profileData || {};

  const skills =
    user.skills ||
    user.skill ||
    user.technicalSkills ||
    [];

  const projects =
    user.projects ||
    user.project ||
    [];

  const education =
    user.education ||
    user.educations ||
    [];

  const experience =
    user.experience ||
    user.experiences ||
    [];

  const achievements =
    user.achievements ||
    user.certifications ||
    [];

  // ---------------------------------------
  // LOADING SCREEN
  // ---------------------------------------

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span>Loading your career profile...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* -------------------------------- */}
        {/* PAGE HEADER */}
        {/* -------------------------------- */}

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Resume AI
            </h1>

            <p className="text-sm text-slate-500">
              Analyze your profile and prepare for your target role.
            </p>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* PROFILE LOAD ERROR */}
        {/* -------------------------------- */}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />

            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* -------------------------------- */}
        {/* TARGET SECTION */}
        {/* -------------------------------- */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 space-y-5">

          <div>
            <h2 className="text-base font-bold text-white">
              Target
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Select your target company and role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* COMPANY */}

            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              {companies.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            {/* ROLE */}

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              {roles.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3">

            <button
              onClick={handleAnalyzeProfile}
              disabled={analysisLoading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2"
            >
              {analysisLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Profile
                </>
              )}
            </button>

            <button
              onClick={handleGenerateResume}
              disabled={resumeLoading}
              className="px-5 py-3 rounded-xl border border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 disabled:opacity-60 text-blue-300 text-sm font-semibold flex items-center gap-2"
            >
              {resumeLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Resume
                </>
              )}
            </button>

          </div>

          {/* ANALYSIS ERROR */}

          {analysisError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />

              <p className="text-sm text-red-300">
                {analysisError}
              </p>
            </div>
          )}

          {/* RESUME ERROR */}

          {resumeError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />

              <p className="text-sm text-red-300">
                {resumeError}
              </p>
            </div>
          )}

        </div>

        {/* -------------------------------- */}
        {/* PROFILE SUMMARY */}
        {/* -------------------------------- */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 space-y-5">

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-500" />

            <div>
              <h2 className="font-bold text-white">
                Your Profile
              </h2>

              <p className="text-xs text-slate-500">
                Information available from your NEXORA profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
              <p className="text-xs text-slate-500">
                Name
              </p>

              <p className="text-sm font-semibold text-white mt-1">
                {user.name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
              <p className="text-xs text-slate-500">
                Email
              </p>

              <p className="text-sm font-semibold text-white mt-1 break-all">
                {user.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
              <p className="text-xs text-slate-500">
                College
              </p>

              <p className="text-sm font-semibold text-white mt-1">
                {user.college ||
                  user.university ||
                  "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
              <p className="text-xs text-slate-500">
                Branch
              </p>

              <p className="text-sm font-semibold text-white mt-1">
                {user.branch ||
                  user.department ||
                  "Not available"}
              </p>
            </div>

          </div>
        </div>

        {/* -------------------------------- */}
        {/* SKILLS */}
        {/* -------------------------------- */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-5 h-5 text-blue-500" />

            <h2 className="font-bold text-white">
              Skills
            </h2>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium"
                >
                  {typeof skill === "string"
                    ? skill
                    : skill.name || skill.title || "Skill"}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No skills available in your profile yet.
            </p>
          )}

        </div>

        {/* -------------------------------- */}
        {/* PROJECTS */}
        {/* -------------------------------- */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

          <div className="flex items-center gap-3 mb-4">
            <FolderKanban className="w-5 h-5 text-blue-500" />

            <h2 className="font-bold text-white">
              Projects
            </h2>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-black/30 p-4"
                >
                  <p className="font-semibold text-white">
                    {project.name ||
                      project.title ||
                      "Project"}
                  </p>

                  {project.description && (
                    <p className="text-xs text-slate-500 mt-1">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No projects available in your profile yet.
            </p>
          )}

        </div>

        {/* -------------------------------- */}
        {/* EDUCATION */}
        {/* -------------------------------- */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-blue-500" />

            <h2 className="font-bold text-white">
              Education
            </h2>
          </div>

          {education.length > 0 ? (
            <div className="space-y-3">
              {education.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-black/30 p-4"
                >
                  <p className="font-semibold text-white">
                    {item.degree ||
                      item.course ||
                      item.title ||
                      "Education"}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.college ||
                      item.university ||
                      item.institution ||
                      ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No education information available yet.
            </p>
          )}

        </div>

        {/* -------------------------------- */}
        {/* EXPERIENCE */}
        {/* -------------------------------- */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-blue-500" />

            <h2 className="font-bold text-white">
              Experience
            </h2>
          </div>

          {experience.length > 0 ? (
            <div className="space-y-3">
              {experience.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-black/30 p-4"
                >
                  <p className="font-semibold text-white">
                    {item.role ||
                      item.position ||
                      item.title ||
                      "Experience"}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.company || ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No experience information available yet.
            </p>
          )}

        </div>

        {/* -------------------------------- */}
        {/* ANALYSIS RESULT */}
        {/* -------------------------------- */}

        {analysis && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-5">

            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />

              <h2 className="font-bold text-white">
                Resume Analysis
              </h2>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/30 p-5">

              {typeof analysis === "string" ? (
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {analysis}
                </p>
              ) : (
                <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              )}

            </div>

          </div>
        )}

        {/* -------------------------------- */}
        {/* GENERATED RESUME */}
        {/* -------------------------------- */}

        {resume && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 space-y-5">

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-400" />

              <h2 className="font-bold text-white">
                Generated Resume
              </h2>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/30 p-5">

              {typeof resume === "string" ? (
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {resume}
                </p>
              ) : (
                <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(resume, null, 2)}
                </pre>
              )}

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default ResumeAI;