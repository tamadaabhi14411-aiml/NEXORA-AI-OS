import { useState } from "react";
import { Link } from "react-router-dom";
import { calculateMatchScore } from "../../utils/matchingAlgorithm";
import SDGBadge from "../ui/SDGBadge";
import ConnectModal from "./ConnectModal";
import { Sparkles, MapPin, Award, CheckCircle2, UserPlus, Info, Check } from "lucide-react";

export default function CollaboratorMatchCard({ user, project, targetSkills = [], targetSdgs = [] }) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  // If a project is provided, match against it. Otherwise create a mock project structure from selected target skills/sdgs
  const evalProject = project || {
    requiredSkills: targetSkills.length ? targetSkills : ["React", "Python", "Node.js"],
    sdgs: targetSdgs.length ? targetSdgs : [13, 7, 6]
  };

  const match = calculateMatchScore(user, evalProject);

  // Color mapping based on Match %
  const getMatchBadgeStyle = (pct) => {
    if (pct >= 90) return "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20";
    if (pct >= 75) return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
    return "bg-teal-900/30 text-teal-300 border border-teal-700/50";
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between h-full relative group">
        
        {/* Top Header: Avatar, Name, Title, and Match % Pill */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition-all shrink-0"
              />
              <div>
                <Link
                  to={`/user/${user.id}`}
                  className="font-bold text-base text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{user.name}</span>
                </Link>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">{user.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {user.location.split(',')[0]}
                  </span>
                  <span>•</span>
                  <span className="text-slate-300">{user.experienceLevel} Level</span>
                </div>
              </div>
            </div>

            {/* Core Match Percentage Badge */}
            <div className="flex flex-col items-end">
              <div
                className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${getMatchBadgeStyle(
                  match.percentage
                )}`}
                onClick={() => setShowMatchDetails(!showMatchDetails)}
                title="Click for match breakdown"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{match.percentage}% Match</span>
              </div>
              <button
                onClick={() => setShowMatchDetails(!showMatchDetails)}
                className="text-[10px] text-slate-400 hover:text-emerald-400 mt-1 flex items-center gap-0.5"
              >
                <Info className="w-3 h-3" />
                <span>Breakdown</span>
              </button>
            </div>
          </div>

          {/* Optional Detailed Match Breakdown Dropdown */}
          {showMatchDetails && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs space-y-2 animate-fadeIn">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Skill Match ({match.skillScore}%):</span>
                <span className="text-emerald-400">
                  {match.skillMatches.length} / {match.totalRequiredSkills} Required
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${match.skillScore}%` }}
                />
              </div>

              <div className="flex justify-between text-slate-300 font-semibold pt-1">
                <span>SDG Goal Alignment ({match.sdgScore}%):</span>
                <span className="text-teal-400">
                  {match.sdgMatches.length} Matched SDGs
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-400 h-full rounded-full"
                  style={{ width: `${match.sdgScore}%` }}
                />
              </div>
            </div>
          )}

          {/* User Bio */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {user.bio}
          </p>

          {/* Skill Badges with Overlap Highlight */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
              <span>Skills & Expertise:</span>
              <span className="text-emerald-400 text-[10px]">{user.availability}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill) => {
                const isMatched = match.skillMatches.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 border ${
                      isMatched
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-xs"
                        : "bg-slate-900 text-slate-300 border-slate-800"
                    }`}
                  >
                    {isMatched && <Check className="w-3 h-3 text-emerald-400" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* SDG Goal Interests */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
              SDG Goal Focus:
            </span>
            <div className="flex flex-wrap gap-1">
              {user.sdgInterests.map((sdgId) => (
                <SDGBadge key={sdgId} sdgId={sdgId} size="sm" showLabel={true} />
              ))}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2">
          <Link
            to={`/user/${user.id}`}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-center bg-slate-800/80 hover:bg-slate-700 text-white transition-colors border border-slate-700/60"
          >
            View Profile
          </Link>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Connect / Join</span>
          </button>
        </div>

      </div>

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <ConnectModal
          user={user}
          project={project}
          matchPercentage={match.percentage}
          onClose={() => setIsConnectModalOpen(false)}
        />
      )}
    </>
  );
}
