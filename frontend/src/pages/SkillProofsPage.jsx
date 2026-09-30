import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  AlertCircle,
  FolderKanban,
} from "lucide-react";
import skillProofService from "../services/skillProofService";
import SkillProofCard from "../components/skillProof/SkillProofCard";

export default function SkillProofsPage() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProofs = async () => {
      setLoading(true);
      setError("");

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
          setProofs(items);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load skill proofs.");
          setProofs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProofs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-purple-400" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-purple-400">
                Project-based skill proof
              </p>

              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Skill Proofs
              </h1>

              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Skill evidence connected to completed projects and real
                contributions.
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
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
                <h2 className="text-sm font-bold text-red-300">
                  Unable to load skill proofs.
                </h2>

                <p className="text-xs text-red-300/70 mt-1">
                  Skill Proof data is not available from the current backend.
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && proofs.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FolderKanban className="w-7 h-7 text-purple-400" />
            </div>

            <h2 className="text-xl font-bold text-white mt-5">
              No skill proofs yet.
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Complete a project to build proof of your skills.
            </p>

            <Link
              to="/projects"
              className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold text-white transition-all"
            >
              View Projects
            </Link>
          </div>
        )}

        {!loading && !error && proofs.length > 0 && (
          <div className="grid gap-5">
            {proofs.map((proof) => (
              <SkillProofCard
                key={proof.id || proof._id}
                proof={proof}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
