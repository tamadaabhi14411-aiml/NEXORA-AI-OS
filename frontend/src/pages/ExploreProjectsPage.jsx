import { useNavigate } from "react-router-dom";
import { FolderKanban, Plus, AlertCircle } from "lucide-react";

export default function ExploreProjectsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
              <FolderKanban className="w-4 h-4" />
              Collaborative Projects
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Projects
            </h1>

            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Discover community projects, join teams, work on tasks, and build
              verified skill experience.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects/create")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>

        {/* Backend unavailable state */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-purple-400" />
          </div>

          <h2 className="text-xl font-bold text-white mt-5">
            Project data unavailable
          </h2>

          <p className="text-sm text-slate-400 max-w-xl mx-auto mt-3 leading-relaxed">
            The current backend does not provide Project APIs yet, so projects
            cannot be loaded without using fake data.
          </p>

          <p className="text-xs text-slate-500 max-w-xl mx-auto mt-3">
            The Day 17 frontend structure is ready, but project creation,
            joining, members, tasks, and progress require backend support.
          </p>

          <button
            type="button"
            onClick={() => navigate("/community")}
            className="mt-6 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-colors"
          >
            Browse Communities
          </button>
        </div>

      </div>
    </div>
  );
}
