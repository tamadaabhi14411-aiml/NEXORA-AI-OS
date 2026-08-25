import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import SDGBadge from "../ui/SDGBadge";
import { calculateMatchScore } from "../../utils/matchingAlgorithm";
import { Bookmark, Users, MapPin, Sparkles, ArrowRight } from "lucide-react";

export default function ProjectCard({ project, showMatchScore = true }) {
  const { currentUser, savedProjects, toggleSaveProject } = useApp();

  const isSaved = savedProjects.includes(project.id);
  const matchResult = calculateMatchScore(currentUser, project);

  const statusColors = {
    Recruiting: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    "In Progress": "bg-teal-500/20 text-teal-400 border-teal-500/40",
    Completed: "bg-slate-500/20 text-slate-400 border-slate-500/40"
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-slate-800/80 group">
      
      {/* Card Header Banner Image */}
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <img
          src={project.banner}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          
          {/* Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${statusColors[project.status] || "bg-slate-800 text-slate-300"}`}>
            {project.status}
          </span>

          {/* Bookmark & Match Score */}
          <div className="flex items-center gap-2">
            {showMatchScore && (
              <div className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-emerald-500/50 backdrop-blur-md flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-xs font-extrabold text-emerald-400">{matchResult.percentage}% Match</span>
              </div>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSaveProject(project.id);
              }}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
                isSaved
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-slate-950/60 border-slate-700/60 text-slate-400 hover:text-white"
              }`}
              title={isSaved ? "Saved to Bookmarks" : "Save project"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-emerald-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* SDG Badges on banner bottom */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {project.sdgs.slice(0, 2).map((sdgId) => (
            <SDGBadge key={sdgId} sdgId={sdgId} size="sm" showLabel={true} />
          ))}
          {project.sdgs.length > 2 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900/90 text-slate-300 font-bold border border-slate-700">
              +{project.sdgs.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            {project.organizationName}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Skills Required Pills */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5 block">
            Required Tech Stack:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills.slice(0, 4).map((skill) => {
              const isUserSkill = currentUser.skills.some(
                (s) => s.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={skill}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                    isUserSkill
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-900 text-slate-300 border-slate-800"
                  }`}
                >
                  {skill} {isUserSkill && "✓"}
                </span>
              );
            })}
            {project.requiredSkills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                +{project.requiredSkills.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Team size & Location */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.team.length} Team Members</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[110px]">{project.location.split('/')[0]}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/project/${project.id}`}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-center bg-slate-800/80 hover:bg-slate-700 text-white transition-colors border border-slate-700/60 flex items-center justify-center gap-1"
          >
            <span>Details</span>
          </Link>

          <Link
            to={`/collaborators?projectId=${project.id}`}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <span>Match Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
