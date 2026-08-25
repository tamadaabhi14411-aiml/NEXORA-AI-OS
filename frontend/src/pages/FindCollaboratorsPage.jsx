import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CollaboratorMatchCard from "../components/projects/CollaboratorMatchCard";
import SDGBadge from "../components/ui/SDGBadge";
import { calculateMatchScore } from "../utils/matchingAlgorithm";
import { Sparkles, Search, Filter, Layers, Check, RefreshCw } from "lucide-react";

export default function FindCollaboratorsPage() {
  const { users, projects, sdgList } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialProjectId = searchParams.get("projectId") || projects[0]?.id || "proj_1";

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [searchTerm, setSearchTerm] = useState("");
  const [minMatchPct, setMinMatchPct] = useState(40);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedSdg, setSelectedSdg] = useState("");

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Calculate and sort collaborators by match percentage against active project
  const matchedCollaborators = useMemo(() => {
    return users
      .map((user) => {
        const matchResult = calculateMatchScore(user, activeProject);
        return {
          user,
          match: matchResult
        };
      })
      .filter(({ user, match }) => {
        // Exclude project creator/members if desired, or show all
        const matchesSearch =
          searchTerm === "" ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesMinScore = match.percentage >= Number(minMatchPct);

        const matchesExp =
          selectedExperience === "" || user.experienceLevel === selectedExperience;

        const matchesSdg =
          selectedSdg === "" || user.sdgInterests.includes(Number(selectedSdg));

        return matchesSearch && matchesMinScore && matchesExp && matchesSdg;
      })
      .sort((a, b) => b.match.percentage - a.match.percentage);
  }, [users, activeProject, searchTerm, minMatchPct, selectedExperience, selectedSdg]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Core Match Engine: Skill Overlap + SDG Interest</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Find Matched Collaborators</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Match developers, researchers, and designers with project requirements using skill overlap, SDG alignment, and availability scoring.
            </p>
          </div>

          {/* Target Project Selection Selector */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 shrink-0 max-w-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Match Teammates For Project:
            </span>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSearchParams({ projectId: e.target.value });
              }}
              className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.requiredSkills.length} Skills Required)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Project Summary Pill */}
        {activeProject && (
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold">Active Criteria:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                Skills: {activeProject.requiredSkills.join(", ")}
              </span>
              <div className="flex gap-1">
                {activeProject.sdgs.map((sdgId) => (
                  <SDGBadge key={sdgId} sdgId={sdgId} size="sm" showLabel={true} />
                ))}
              </div>
            </div>

            <div className="text-emerald-400 font-bold">
              {matchedCollaborators.length} Matched Profiles Found
            </div>
          </div>
        )}

      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search collaborator name or skill */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Search Teammates:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Name, skill (e.g. React), or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Min Match % Filter Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Min Match Score:</span>
              <span className="text-emerald-400 font-bold">{minMatchPct}%+</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={minMatchPct}
              onChange={(e) => setMinMatchPct(e.target.value)}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2"
            />
          </div>

          {/* Experience level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Experience Level:
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Levels</option>
              <option value="Junior">Junior</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* SDG Goal Focus */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              SDG Goal Interest:
            </label>
            <select
              value={selectedSdg}
              onChange={(e) => setSelectedSdg(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All SDG Interests</option>
              {sdgList.map((sdg) => (
                <option key={sdg.id} value={sdg.id}>
                  SDG {sdg.number}: {sdg.title}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Collaborators Match Grid */}
      {matchedCollaborators.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <Filter className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No collaborators matched current criteria</h3>
          <p className="text-xs text-slate-400">Lower the minimum match percentage threshold or search filters.</p>
          <button
            onClick={() => {
              setMinMatchPct(20);
              setSearchTerm("");
              setSelectedExperience("");
              setSelectedSdg("");
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white"
          >
            Reset Match Threshold
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedCollaborators.map(({ user, match }) => (
            <CollaboratorMatchCard
              key={user.id}
              user={user}
              project={activeProject}
            />
          ))}
        </div>
      )}

    </div>
  );
}
