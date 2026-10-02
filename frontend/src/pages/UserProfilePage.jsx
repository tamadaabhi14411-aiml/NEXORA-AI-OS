import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Award,
  Mail,
  Sparkles,
  Zap,
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  FolderKanban,
  Send,
  Lightbulb,
  Code2,
  UserRoundCheck,
  Trophy,
  Building2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import skillProofService from "../services/skillProofService";
import SkillProofCard from "../components/skillProof/SkillProofCard";

export default function UserProfilePage() {
  const { user, loading } = useAuth();

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [learningText, setLearningText] = useState("");
  const [builtText, setBuiltText] = useState("");
  const [skillText, setSkillText] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [skillPost, setSkillPost] = useState(null);

  useEffect(() => {
    try {
      const savedSkillPost = localStorage.getItem("nexora_skill_post");

      if (!savedSkillPost) {
        return;
      }

      const parsedSkillPost = JSON.parse(savedSkillPost);

      if (parsedSkillPost && typeof parsedSkillPost === "object") {
        setSkillPost(parsedSkillPost);
      }
    } catch (error) {
      console.error("Unable to restore Skill Post:", error);
      localStorage.removeItem("nexora_skill_post");
    }
  }, []);

  const [skillProofs, setSkillProofs] = useState([]);
  const [skillProofLoading, setSkillProofLoading] = useState(true);
  const [skillProofError, setSkillProofError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSkillProofs = async () => {
      setSkillProofLoading(true);
      setSkillProofError("");

      try {
        const data = await skillProofService.getMySkillProofs();

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.proofs)
            ? data.proofs
            : Array.isArray(data?.data)
              ? data.data
              : [];

        if (isMounted) {
          setSkillProofs(items);
        }
      } catch {
        if (isMounted) {
          setSkillProofs([]);
          setSkillProofError("Unable to load skill proofs.");
        }
      } finally {
        if (isMounted) {
          setSkillProofLoading(false);
        }
      }
    };

    if (user) {
      loadSkillProofs();
    } else {
      setSkillProofLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-slate-400">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center">
          <User className="w-10 h-10 mx-auto text-slate-500 mb-4" />

          <h1 className="text-xl font-bold text-white">
            Profile unavailable
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Please log in again to view your profile.
          </p>

          <Link
            to="/login"
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.fullName || "NEXORA User";

  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=0f172a&color=ffffff`;

  const role = user.role || "student";
  const xp = user.xp ?? 0;
  const level = user.level ?? 1;

  const handleCreatePost = (event) => {
    event.preventDefault();

    if (
      !learningText.trim() &&
      !builtText.trim() &&
      !skillText.trim() &&
      !evidenceText.trim()
    ) {
      return;
    }

    const newSkillPost = {
      learning: learningText.trim(),
      built: builtText.trim(),
      skill: skillText.trim(),
      evidence: evidenceText.trim(),
      createdAt: new Date().toISOString(),
    };

    setSkillPost(newSkillPost);

    localStorage.setItem(
      "nexora_skill_post",
      JSON.stringify(newSkillPost)
    );

    setLearningText("");
    setBuiltText("");
    setSkillText("");
    setEvidenceText("");
    setIsPostOpen(false);
  };

  const EmptyState = ({ message, detail }) => (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5">
      <p className="text-sm text-slate-400">
        {message}
      </p>

      {detail && (
        <p className="text-xs text-slate-600 mt-2">
          {detail}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* =========================================================
          PROFILE HEADER
      ========================================================== */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            <img
              src={avatar}
              alt={displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-blue-500/30 shrink-0"
            />

            <div className="space-y-2">

              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {displayName}
                </h1>

                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  Skill Identity
                </span>
              </div>

              <p className="text-sm font-semibold text-blue-400 capitalize">
                {role}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${user.email}`}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Email User"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Real Backend Reputation Data */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800">

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              XP
            </span>

            <span className="text-xl font-black text-blue-400 flex items-center gap-1 mt-1">
              <Zap className="w-5 h-5" />
              {xp} XP
            </span>

            <p className="text-[10px] text-slate-600 mt-1">
              Backend value
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Level
            </span>

            <span className="text-xl font-black text-slate-200 flex items-center gap-1 mt-1">
              <Award className="w-5 h-5 text-amber-400" />
              {level}
            </span>

            <p className="text-[10px] text-slate-600 mt-1">
              Backend value
            </p>
          </div>

        </div>
      </div>

      {/* =========================================================
          SKILL IDENTITY
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">

        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Skill Identity
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              A profile-based identity built from available NEXORA data.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Role
              </span>
            </div>

            <p className="text-sm font-semibold text-white capitalize">
              {role}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] uppercase font-bold text-slate-500">
                XP
              </span>
            </div>

            <p className="text-sm font-semibold text-white">
              {xp} XP
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Level
              </span>
            </div>

            <p className="text-sm font-semibold text-white">
              Level {level}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserRoundCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Profile
              </span>
            </div>

            <p className="text-sm font-semibold text-emerald-300">
              Active
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Skills, achievements and verification status are displayed only
            when real backend data is available. No skill or verification
            status is invented.
          </p>
        </div>

      </div>

      {/* =========================================================
          SKILL EVIDENCE
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Skill Evidence
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Evidence can include projects, learning milestones,
              assessments, achievements, teaching and community activity.
            </p>
          </div>
        </div>

        {skillPost ? (
          <div className="space-y-3">

            {skillPost.learning && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />

                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Learning Milestone
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {skillPost.learning}
                </p>
              </div>
            )}

            {skillPost.built && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />

                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Project Completed
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {skillPost.built}
                </p>
              </div>
            )}

            {skillPost.evidence && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FolderKanban className="w-4 h-4 text-purple-400" />

                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Project Evidence
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {skillPost.evidence}
                </p>
              </div>
            )}

            {skillPost.skill && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />

                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Skill Used
                  </span>
                </div>

                <span className="inline-flex px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                  {skillPost.skill}
                </span>
              </div>
            )}

          </div>
        ) : (
          <EmptyState
            message="No backend skill evidence is currently available."
            detail="You can create a session-only Skill Post below to preview evidence."
          />
        )}

      </div>

      {/* =========================================================
          PROJECTS
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-purple-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Projects
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Projects connected to this user's Skill Identity.
            </p>
          </div>
        </div>

        <EmptyState
          message="No backend project data is currently available."
          detail="Project information will appear here when a project API is connected."
        />

      </div>

      {/* =========================================================
          SKILL PROOF
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-purple-400" />

            <div>
              <h3 className="text-base font-bold text-white">
                Skill Proof
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Project-based evidence of skills and contributions.
              </p>
            </div>
          </div>

          <Link
            to="/profile/skill-proofs"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            View All Skill Proofs
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>

        {skillProofLoading && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center">
            <p className="text-sm text-slate-400">
              Loading skill proofs...
            </p>
          </div>
        )}

        {!skillProofLoading && skillProofError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-red-300">
                  Unable to load skill proofs.
                </p>

                <p className="text-xs text-red-300/70 mt-1">
                  Skill Proof data is not available from the current backend.
                </p>
              </div>
            </div>
          </div>
        )}

        {!skillProofLoading &&
          !skillProofError &&
          skillProofs.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
              <Award className="w-7 h-7 mx-auto text-slate-600" />

              <p className="text-sm text-slate-400 mt-3">
                No skill proofs yet.
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Complete a project to build proof of your skills.
              </p>
            </div>
          )}

        {!skillProofLoading &&
          !skillProofError &&
          skillProofs.length > 0 && (
            <div className="grid gap-4">
              {skillProofs.slice(0, 3).map((proof) => (
                <SkillProofCard
                  key={proof.id || proof._id}
                  proof={proof}
                />
              ))}

              {skillProofs.length > 3 && (
                <div className="flex justify-end">
                  <Link
                    to="/profile/skill-proofs"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    View all {skillProofs.length} skill proofs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

      </div>

      {/* =========================================================
          ACHIEVEMENTS
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Achievements
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Completed milestones and achievements connected to this profile.
            </p>
          </div>
        </div>

        <EmptyState
          message="No backend achievement data is currently available."
          detail="Achievements will appear here when real achievement data is provided."
        />

      </div>

      {/* =========================================================
          TEACHING ACTIVITY
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-teal-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Teaching Activity
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Teaching contributions and learning support provided to others.
            </p>
          </div>
        </div>

        <EmptyState
          message="No backend teaching activity is currently available."
          detail="Teaching evidence will appear when supported by the backend."
        />

      </div>

      {/* =========================================================
          FOLLOWERS / FOLLOWING
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Network
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Followers and following are controlled by the backend Follow API.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />

              <div>
                <h3 className="text-sm font-bold text-white">
                  Followers
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Follow API not available
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-4">
              Count unavailable
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">

            <div className="flex items-center gap-3">
              <UserRoundCheck className="w-5 h-5 text-emerald-400" />

              <div>
                <h3 className="text-sm font-bold text-white">
                  Following
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Follow API not available
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-4">
              Count unavailable
            </p>

          </div>

        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            The current backend does not expose Follow, Followers or Following
            endpoints. No fake follow state or follower count is created.
          </p>
        </div>

      </div>

      {/* =========================================================
          COMMUNITIES
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Communities
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Communities connected to this user's identity.
            </p>
          </div>
        </div>

        <EmptyState
          message="No backend community membership data is currently available."
          detail="Community information will appear here when supported by the backend."
        />

      </div>

      {/* =========================================================
          SKILL POST
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-400" />

            <div>
              <h3 className="text-base font-bold text-white">
                Skill Posts
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Share what you learned, built and the skills you used.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPostOpen((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            {isPostOpen ? "Close" : "Create Skill Post"}
          </button>

        </div>

        {/* Create Post Form */}
        {isPostOpen && (
          <form
            onSubmit={handleCreatePost}
            className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5 space-y-4"
          >

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                What did you learn?
              </label>

              <textarea
                value={learningText}
                onChange={(event) => setLearningText(event.target.value)}
                rows={3}
                placeholder="Example: I learned how React Context API works..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                What did you build?
              </label>

              <textarea
                value={builtText}
                onChange={(event) => setBuiltText(event.target.value)}
                rows={3}
                placeholder="Example: I built a React authentication flow..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Skill used
              </label>

              <input
                type="text"
                value={skillText}
                onChange={(event) => setSkillText(event.target.value)}
                placeholder="Example: React, JavaScript, Java"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
                Project evidence
              </label>

              <input
                type="text"
                value={evidenceText}
                onChange={(event) => setEvidenceText(event.target.value)}
                placeholder="Example: NEXORA AI OS frontend integration"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">

              <button
                type="button"
                onClick={() => setIsPostOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Share Post
              </button>

            </div>

            <p className="text-[10px] text-slate-600">
              This Skill Post is currently session-only because the backend
              does not provide a Skill Post persistence API.
            </p>

          </form>
        )}

        {/* Created Post */}
        {skillPost && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">

            <div className="flex items-center gap-3">

              <img
                src={avatar}
                alt={displayName}
                className="w-10 h-10 rounded-xl object-cover"
              />

              <div>
                <h4 className="text-sm font-bold text-white">
                  {displayName}
                </h4>

                <p className="text-[10px] text-slate-500">
                  Session-only Skill Progress
                </p>
              </div>

            </div>

            {skillPost.learning && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Learned
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {skillPost.learning}
                </p>
              </div>
            )}

            {skillPost.built && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Built
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {skillPost.built}
                </p>
              </div>
            )}

            {skillPost.skill && (
              <div className="flex flex-wrap items-center gap-2">

                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Skill
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-semibold">
                  {skillPost.skill}
                </span>

              </div>
            )}

            {skillPost.evidence && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Project Evidence
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {skillPost.evidence}
                </p>
              </div>
            )}

          </div>
        )}

      </div>

      {/* =========================================================
          BADGES
      ========================================================== */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Badges
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Recognition earned through NEXORA activities.
            </p>
          </div>
        </div>

        <EmptyState
          message="No backend badge data is currently available."
          detail="Badges will appear here when real backend badge data is provided."
        />

      </div>

    </div>
  );
}

