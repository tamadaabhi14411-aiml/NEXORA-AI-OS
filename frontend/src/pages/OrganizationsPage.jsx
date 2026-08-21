import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SDGBadge from "../components/ui/SDGBadge";
import { Building2, Globe, Users, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";

export default function OrganizationsPage() {
  const { organizations, projects } = useApp();
  const [filterType, setFilterType] = useState("");

  const filteredOrgs = organizations.filter(
    (org) => filterType === "" || org.type === filterType
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>SDG Connect Partner Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Organizations & NGOs</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Connect with non-profits, academic research centers, social enterprises, and clean tech incubators driving sustainable technology initiatives worldwide.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["", "Non-Profit Tech Collective", "International NGO", "Academic Research Center", "Social Enterprise", "Green Tech Startup Incubator", "Educational Foundation"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {type === "" ? "All Partner Types" : type}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => {
          const orgProjects = projects.filter((p) => p.organizationId === org.id);
          return (
            <div
              key={org.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between h-full group"
            >
              
              <div>
                {/* Cover & Logo */}
                <div className="relative h-32 bg-slate-900 overflow-hidden">
                  <img
                    src={org.cover}
                    alt={org.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-lg shrink-0"
                    />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-emerald-400">{org.type}</span>
                      {org.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {org.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {org.tagline}
                    </p>
                  </div>

                  {/* SDGs Supported */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                      Supported SDGs:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {org.sdgs.map((sdgId) => (
                        <SDGBadge key={sdgId} sdgId={sdgId} size="sm" showLabel={false} />
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{org.location.split('/')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{org.membersCount} Members</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <a
                  href={org.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-center bg-slate-800/80 hover:bg-slate-700 text-white transition-colors border border-slate-700/60 flex items-center justify-center gap-1"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <Link
                  to={`/projects`}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Projects ({orgProjects.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
