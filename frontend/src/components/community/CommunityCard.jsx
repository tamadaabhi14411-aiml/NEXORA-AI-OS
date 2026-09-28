import { Users, ArrowRight } from "lucide-react";

export default function CommunityCard({
  community,
  onView,
}) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden hover:border-purple-500/30 transition-all duration-200">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-400" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-white truncate">
              {community.name}
            </h3>

            <p className="text-xs text-purple-400 mt-1">
              {community.skill || "Skill community"}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mt-4 line-clamp-3">
          {community.description ||
            "Learn together, share knowledge and build projects with other learners."}
        </p>

        {/* Members */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" />

          <span>
            {community.memberCount != null
              ? `${community.memberCount} Members`
              : "Members unavailable"}
          </span>
        </div>

        {/* Creator */}
        <div className="mt-3">
          <span className="text-[10px] uppercase tracking-wider text-slate-600">
            Creator
          </span>

          <p className="text-xs text-slate-400 mt-1">
            {community.creator || "Creator information unavailable"}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => onView?.(community)}
          className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          View Community
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}