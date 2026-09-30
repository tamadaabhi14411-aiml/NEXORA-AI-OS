import { Link } from "react-router-dom";
import {
  Award,
  FolderKanban,
  Building2,
  Code2,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

export default function SkillProofCard({ proof }) {
  if (!proof) {
    return null;
  }

  const skill = proof.skill || "Skill unavailable";
  const project =
    proof.projectName || proof.project?.name || "Project unavailable";
  const community =
    proof.communityName ||
    proof.community?.name ||
    "Community unavailable";
  const contribution =
    proof.contribution ||
    proof.userContribution ||
    "Contribution unavailable";
  const status = proof.status || "Project Completed";
  const date = proof.date || proof.completedAt || proof.createdAt;

  const formattedDate = date
    ? new Date(date).toLocaleDateString()
    : "Date unavailable";

  const proofId = proof.id || proof._id;
  const projectId =
    proof.projectId || proof.project?._id || proof.project?.id;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 hover:border-purple-500/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-purple-400" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-purple-400">
              Skill Proof
            </p>

            <h4 className="text-base font-bold text-white mt-1 truncate">
              {skill}
            </h4>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          {status}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] uppercase font-bold text-slate-500">
              Project
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-200 mt-2">
            {project}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] uppercase font-bold text-slate-500">
              Community
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-200 mt-2">
            {community}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] uppercase font-bold text-slate-500">
            Contribution
          </span>
        </div>

        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          {contribution}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {proofId && (
            <Link
              to={`/skill-proof/${proofId}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              View Proof
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {projectId && (
            <Link
              to={`/projects/${projectId}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-semibold text-white transition-all"
            >
              View Project
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
