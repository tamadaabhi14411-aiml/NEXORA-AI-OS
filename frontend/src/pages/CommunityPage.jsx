import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FolderKanban,
  Activity,
  ArrowRight,
  UserPlus,
  CheckCircle2,
  Search,
  AlertCircle,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";

export default function CommunityPage() {
  const { currentUser, organizations, projects } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [joinedCommunity, setJoinedCommunity] = useState(null);

  const communities = useMemo(() => {
    return organizations.map((org) => {
      const communityProjects = projects.filter(
        (project) => project.organizationId === org.id
      );

      const skills = [
        ...new Set(
          communityProjects.flatMap(
            (project) => project.requiredSkills || []
          )
        ),
      ];

      return {
        id: org.id,
        name: org.name,
        topic: skills.slice(0, 3),
        leader: org.name,
        membersCount: org.membersCount || 0,
        description:
          org.tagline ||
          "A community for students, professionals and builders.",
        projects: communityProjects,
        activity: communityProjects.length
          ? `${communityProjects.length} active project${
              communityProjects.length > 1 ? "s" : ""
            }`
          : "No recent project activity",
      };
    });
  }, [organizations, projects]);

  const filteredCommunities = communities.filter((community) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    return (
      community.name.toLowerCase().includes(search) ||
      community.topic.some((topic) =>
        topic.toLowerCase().includes(search)
      )
    );
  });

  const handleJoin = (communityId) => {
    setJoinedCommunity(communityId);
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-white">
            Unable to load community
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Please login again to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Community</span>
        </div>

        <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Find Your Community
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Connect with communities related to your skills, discover
              projects and collaborate with people building meaningful
              solutions.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search communities or skills..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCommunities.length === 0 && (
        <div className="glass-card rounded-2xl border border-slate-800 p-10 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-white">
            No communities found
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Try searching for another community or skill.
          </p>
        </div>
      )}

      {/* Community Grid */}
      {filteredCommunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => {
            const isJoined = joinedCommunity === community.id;

            return (
              <div
                key={community.id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col"
              >
                {/* Community Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-950/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>

                      <div>
                        <h2 className="text-base font-bold text-white">
                          {community.name}
                        </h2>

                        <p className="text-xs text-slate-500 mt-0.5">
                          Community
                        </p>
                      </div>
                    </div>

                    {isJoined && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Community Content */}
                <div className="p-5 flex-1 space-y-5">
                  {/* Skills */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Skills / Topics
                    </span>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {community.topic.length > 0 ? (
                        community.topic.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-500/30"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">
                          Skills information unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Leader */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Leader / Organization
                    </span>

                    <p className="text-sm text-slate-300 mt-1">
                      {community.leader}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {community.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                    <div className="text-center">
                      <Users className="w-4 h-4 text-slate-500 mx-auto mb-1" />

                      <p className="text-sm font-bold text-white">
                        {community.membersCount}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Members
                      </p>
                    </div>

                    <div className="text-center">
                      <FolderKanban className="w-4 h-4 text-slate-500 mx-auto mb-1" />

                      <p className="text-sm font-bold text-white">
                        {community.projects.length}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Projects
                      </p>
                    </div>

                    <div className="text-center">
                      <Activity className="w-4 h-4 text-slate-500 mx-auto mb-1" />

                      <p className="text-sm font-bold text-white">
                        {community.projects.length > 0 ? "Active" : "—"}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Activity
                      </p>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />

                      <span className="text-xs font-semibold text-slate-300">
                        Community Activity
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      {community.activity}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleJoin(community.id)}
                    disabled={isJoined}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      isJoined
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/60"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Joined
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Join Community
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/projects?organizationId=${community.id}`
                      )
                    }
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-1"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Community Projects */}
      {filteredCommunities.some(
        (community) => community.projects.length > 0
      ) && (
        <section className="space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-emerald-400" />

              <h2 className="text-2xl font-black text-white">
                Community Projects
              </h2>
            </div>

            <p className="text-sm text-slate-400 mt-1">
              Projects associated with the communities above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCommunities
              .flatMap((community) => community.projects)
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
          </div>
        </section>
      )}

      {/* Backend Availability Notice */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-xs text-amber-300 leading-relaxed">
          Community membership and activity are currently represented
          from the available frontend data. No Community backend endpoint
          is being invented or called until the backend provides one.
        </p>
      </div>
    </div>
  );
}