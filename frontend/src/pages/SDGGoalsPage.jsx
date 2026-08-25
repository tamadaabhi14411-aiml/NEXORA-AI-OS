import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";
import { Target, ArrowRight, X, Sparkles, Code2, Globe } from "lucide-react";

export default function SDGGoalsPage() {
  const { sdgList, projects } = useApp();
  const [selectedSdgModal, setSelectedSdgModal] = useState(null);

  const getProjectsForSdg = (sdgId) => {
    return projects.filter((p) => p.sdgs.includes(Number(sdgId)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>United Nations Agenda 2030</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">17 Sustainable Development Goals</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          The Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure peace and prosperity. Explore active tech initiatives for each goal.
        </p>
      </div>

      {/* 17 SDGs Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sdgList.map((sdg) => {
          const sdgProjects = getProjectsForSdg(sdg.id);
          return (
            <div
              key={sdg.id}
              onClick={() => setSelectedSdgModal(sdg)}
              className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 cursor-pointer group transition-all flex flex-col justify-between space-y-4"
            >
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: sdg.color }}
                  >
                    {sdg.number}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-bold">
                    {sdgProjects.length} Projects
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    SDG {sdg.number}: {sdg.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sdg.description}
                  </p>
                </div>

                {/* Related Tech Skills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {sdg.relatedSkills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>View Projects & Impact</span>
                <ArrowRight className="w-4 h-4" />
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for detailed SDG View & Aligned Projects */}
      {selectedSdgModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 animate-fadeIn">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{ backgroundColor: selectedSdgModal.color }}
                >
                  {selectedSdgModal.number}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    SDG {selectedSdgModal.number}: {selectedSdgModal.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedSdgModal.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSdgModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedSdgModal.description}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Key Global Benchmark Metric
                  </span>
                  <p className="text-base font-black text-white">{selectedSdgModal.keyMetrics}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    High Demand Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedSdgModal.relatedSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects list aligned with this SDG */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <span>Projects Aligned with SDG {selectedSdgModal.number} ({getProjectsForSdg(selectedSdgModal.id).length})</span>
                </h3>
                <Link
                  to={`/projects?sdg=${selectedSdgModal.id}`}
                  onClick={() => setSelectedSdgModal(null)}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  View in Explorer →
                </Link>
              </div>

              {getProjectsForSdg(selectedSdgModal.id).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No active projects currently listed for this specific SDG.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getProjectsForSdg(selectedSdgModal.id).map((project) => (
                    <ProjectCard key={project.id} project={project} showMatchScore={true} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
