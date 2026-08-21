import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SDGBadge from "../components/ui/SDGBadge";
import ConnectModal from "../components/projects/ConnectModal";
import ProjectCard from "../components/projects/ProjectCard";
import {
  User,
  MapPin,
  GraduationCap,
  Building2,
  Award,
  Mail,
  UserPlus,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Code,
  Share2
} from "lucide-react";

export default function UserProfilePage() {
  const { id } = useParams();
  const { users, projects, currentUser } = useApp();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // If no ID passed, view logged in user profile
  const user = users.find((u) => u.id === id) || currentUser;
  const isSelf = user.id === currentUser.id;

  // Projects where this user is creator or member
  const userProjects = projects.filter((p) =>
    p.team.some((m) => m.userId === user.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/40 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                {isSelf && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    Your Profile
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-emerald-400">{user.title}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.location}</span>
                </div>
                {user.university && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.university}</span>
                  </div>
                )}
                {user.organization && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isSelf && (
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Connect / Invite to Project</span>
              </button>
            )}

            <a
              href={`mailto:${user.email}`}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Email User"
            >
              <Mail className="w-4 h-4" />
            </a>

            {user.github && (
              <a
                href={`https://${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-xs"
                title="GitHub Profile"
              >
                <Code className="w-4 h-4" />
              </a>
            )}

            {user.linkedin && (
              <a
                href={`https://${user.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-xs"
                title="LinkedIn Profile"
              >
                <Share2 className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
          {user.bio}
        </p>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Impact Score</span>
            <span className="text-base font-black text-emerald-400 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {user.impactPoints} pts
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Projects Completed</span>
            <span className="text-base font-black text-teal-400">{user.projectsCompleted}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Experience Level</span>
            <span className="text-base font-black text-slate-200">{user.experienceLevel}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Weekly Availability</span>
            <span className="text-base font-black text-emerald-300">{user.availability}</span>
          </div>
        </div>

      </div>

      {/* Skills & SDG Goal Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Verified Tech Stack */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Verified Tech Stack</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Primary SDG Focus */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            <span>Primary SDG Goal Focus</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.sdgInterests.map((sdgId) => (
              <SDGBadge key={sdgId} sdgId={sdgId} size="md" showLabel={true} />
            ))}
          </div>
        </div>

      </div>

      {/* Badges Earned */}
      {user.badges && user.badges.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Platform Accomplishment Badges</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((b) => (
              <div
                key={b}
                className="px-3.5 py-2 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Portfolio */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Project Portfolio ({userProjects.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showMatchScore={false} />
          ))}
        </div>
      </div>

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <ConnectModal
          user={user}
          project={projects[0]}
          matchPercentage={92}
          onClose={() => setIsConnectModalOpen(false)}
        />
      )}

    </div>
  );
}
