import { useState } from "react";
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
} from "lucide-react";

export default function UserProfilePage() {
  const { user, loading } = useAuth();

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [learningText, setLearningText] = useState("");
  const [builtText, setBuiltText] = useState("");
  const [skillText, setSkillText] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [skillPost, setSkillPost] = useState(null);

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

    setSkillPost({
      learning: learningText.trim(),
      built: builtText.trim(),
      skill: skillText.trim(),
      evidence: evidenceText.trim(),
    });

    setLearningText("");
    setBuiltText("");
    setSkillText("");
    setEvidenceText("");
    setIsPostOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Profile Header */}
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
                  Your Profile
                </span>
              </div>

              <p className="text-sm font-semibold text-blue-400 capitalize">
                {user.role || "Student"}
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

        {/* Reputation */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800">

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Reputation / XP
            </span>

            <span className="text-xl font-black text-blue-400 flex items-center gap-1 mt-1">
              <Zap className="w-5 h-5" />
              {user.xp ?? 0} XP
            </span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Level
            </span>

            <span className="text-xl font-black text-slate-200 flex items-center gap-1 mt-1">
              <Award className="w-5 h-5 text-amber-400" />
              {user.level ?? 1}
            </span>
          </div>

        </div>

      </div>

      {/* Skill Identity */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Skill Identity
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Skills and verification will appear here when supported by the backend.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-400">
            No backend skill data is currently available for this profile.
          </p>
        </div>

      </div>

      {/* Skill Evidence */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Skill Evidence
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Projects, assessments, learning milestones, peer feedback and teaching activity.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-400">
            No skill evidence is currently available from the backend.
          </p>
        </div>

      </div>

      {/* Projects */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-purple-400" />

          <div>
            <h3 className="text-base font-bold text-white">
              Projects
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Projects connected to this user's skill identity.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-400">
            No backend project data is currently available.
          </p>
        </div>

      </div>

      {/* Teaching Activity */}
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

        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-400">
            No backend teaching activity is currently available.
          </p>
        </div>

      </div>

      {/* Followers */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />

            <div>
              <h3 className="text-base font-bold text-white">
                Followers
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Follower information will appear when the follow API is available.
              </p>
            </div>
          </div>

          <span className="text-xl font-black text-white">
            0
          </span>

        </div>

      </div>

      {/* Skill Post */}
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
              Posts are currently available as frontend session content until a backend post API is provided.
            </p>

          </form>
        )}

        {/* Created Post Card */}
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
                  Skill Progress
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

      {/* Badges */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">

        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />

          <h3 className="text-base font-bold text-white">
            Badges
          </h3>
        </div>

        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5">
          <p className="text-sm text-slate-400">
            No backend badge data is currently available.
          </p>
        </div>

      </div>

    </div>
  );
}