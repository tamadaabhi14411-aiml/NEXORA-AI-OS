import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  FolderKanban,
  Building2,
  Code2,
  CheckCircle2,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import skillProofService from "../services/skillProofService";

export default function SkillProofDetailsPage() {
  const { proofId } = useParams();

  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProof = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await skillProofService.getSkillProof(proofId);

        const item = data?.proof || data?.data || data;

        if (isMounted) {
          setProof(item);
        }
      } catch {
        if (isMounted) {
          setProof(null);
          setError("Unable to load skill proof.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (proofId) {
      loadProof();
    } else {
      setLoading(false);
      setError("Unable to load skill proof.");
    }

    return () => {
      isMounted = false;
    };
  }, [proofId]);

  const skill = proof?.skill || "Skill unavailable";

  const project =
    proof?.projectName ||
    proof?.project?.name ||
    proof?.project?.title ||
    "Project unavailable";

  const community =
    proof?.communityName ||
    proof?.community?.name ||
    "Community unavailable";

  const contribution =
    proof?.contribution ||
    proof?.userContribution ||
    "Contribution unavailable";

  const status = proof?.status || "Project Completed";

  const date =
    proof?.date ||
    proof?.completedAt ||
    proof?.createdAt;

  const formattedDate = date
    ? new Date(date).toLocaleDateString()
    : "Date unavailable";

  const projectId =
    proof?.projectId ||
    proof?.project?._id ||
    proof?.project?.id;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          to="/profile/skill-proofs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Skill Proofs
        </Link>

        {loading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <p className="text-sm text-slate-400">
              Loading skill proofs...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

              <div>
                <h1 className="text-sm font-bold text-red-300">
                  Unable to load skill proof.
                </h1>

                <p className="text-xs text-red-300/70 mt-1">
                  Skill Proof data is not available from the current backend.
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && proof && (
          <>
            <div className="rounded-3xl border border-purple-500/20 bg-slate-900/70 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7 text-purple-400" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-purple-400">
                      Project-based skill proof
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {skill}
                    </h1>

                    <p className="text-sm text-slate-400 mt-2">
                      Evidence connected to a completed project contribution.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {status}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Project
                  </span>
                </div>

                <p className="text-base font-bold text-white mt-3">
                  {project}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Community
                  </span>
                </div>

                <p className="text-base font-bold text-white mt-3">
                  {community}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">
                  User contribution
                </h2>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mt-3">
                {contribution}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Project Completion
                  </span>
                </div>

                <p className="text-sm font-semibold text-emerald-300 mt-3">
                  {status}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Date
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-200 mt-3">
                  {formattedDate}
                </p>
              </div>
            </div>

            {projectId && (
              <div className="flex justify-end">
                <Link
                  to={`/projects/${projectId}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold text-white transition-all"
                >
                  View Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
