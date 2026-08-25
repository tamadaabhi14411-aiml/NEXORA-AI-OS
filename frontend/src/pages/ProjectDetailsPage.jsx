import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SDGBadge from "../components/ui/SDGBadge";
import ConnectModal from "../components/projects/ConnectModal";
import { calculateMatchScore } from "../utils/matchingAlgorithm";
import {
  Globe,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Bookmark,
  Kanban,
  Target,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Building2
} from "lucide-react";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, currentUser, savedProjects, toggleSaveProject, organizations } = useApp();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const project = projects.find((p) => p.id === id) || projects[0];
  const isSaved = savedProjects.includes(project.id);
  const match = calculateMatchScore(currentUser, project);

  const org = organizations.find((o) => o.id === project.organizationId) || {
    name: project.organizationName,
    type: "Sustainability Organization",
    website: "https://sdgconnect.org"
  };

  const isMember = project.team.some((m) => m.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 relative">
        <div className="h-64 sm:h-80 w-full relative bg-slate-900">
          <img
            src={project.banner}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2">
              {project.sdgs.map((sdgId) => (
                <SDGBadge key={sdgId} sdgId={sdgId} size="md" showLabel={true} />
              ))}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-emerald-500/50 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-400">{match.percentage}% Match for You</span>
              </div>

              <button
                onClick={() => toggleSaveProject(project.id)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors ${
                  isSaved
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-emerald-400" : ""}`} />
              </button>
            </div>

          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">{project.title}</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-semibold">{project.organizationName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Created {project.createdAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{project.team.length} Active Collaborators</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Details Left, Actions/Team Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>Project Overview</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Impact Goal */}
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Measurable Impact Target</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              {project.impactGoal}
            </p>
            {project.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-500/20 text-xs">
                {Object.entries(project.metrics).map(([key, val]) => (
                  <div key={key} className="bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 uppercase block">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm font-bold text-emerald-400">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Required Skills & Tech Stack */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Required Skills & Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => {
                const isMatch = currentUser.skills.some(
                  (s) => s.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <div
                    key={skill}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                      isMatch
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                        : "bg-slate-900 text-slate-300 border-slate-800"
                    }`}
                  >
                    {isMatch && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    <span>{skill}</span>
                    {isMatch && <span className="text-[10px] text-emerald-400 font-normal">(Your Skill)</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open Roles */}
          {project.openRoles && project.openRoles.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Open Roles Needed</h3>
              <div className="space-y-3">
                {project.openRoles.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400">{r.role}</h4>
                      <div className="flex gap-1">
                        {r.skillsNeeded.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Actions & Team Roster */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 sticky top-20">
            
            <h3 className="text-base font-bold text-white">Project Actions</h3>

            {isMember ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>You are a team member on this project!</span>
                </div>
                <Link
                  to={`/workspace/${project.id}`}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 shadow-md"
                >
                  <Kanban className="w-4 h-4" />
                  <span>Open Project Workspace</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Apply / Request to Join Team</span>
                </button>

                <Link
                  to={`/workspace/${project.id}`}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
                >
                  <Kanban className="w-4 h-4 text-teal-400" />
                  <span>View Public Workspace</span>
                </Link>
              </div>
            )}

            {/* Direct Jump to Collaborator Matcher */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Looking for more teammates?
              </span>
              <Link
                to={`/collaborators?projectId=${project.id}`}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Find Collaborators for this Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Organization info */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Host Organization</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                  {project.organizationName.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{project.organizationName}</h4>
                  <a href={org.website} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-400 hover:underline">
                    {org.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Current Team Roster</span>
                <span className="text-[11px] text-slate-400 font-normal">{project.team.length} members</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {project.team.map((m) => (
                  <div key={m.userId} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <span className="text-xs font-semibold text-white block leading-tight">{m.name}</span>
                        <span className="text-[10px] text-slate-400 block leading-tight">{m.role}</span>
                      </div>
                    </div>
                    <Link to={`/user/${m.userId}`} className="text-[10px] text-emerald-400 hover:underline">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <ConnectModal
          user={project.team[0] ? { id: project.team[0].userId, name: project.team[0].name, role: project.team[0].role, avatar: project.team[0].avatar } : currentUser}
          project={project}
          matchPercentage={match.percentage}
          onClose={() => setIsConnectModalOpen(false)}
        />
      )}

    </div>
  );
}
