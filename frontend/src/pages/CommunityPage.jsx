import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FolderKanban,
  Activity,
  ArrowRight,
  UserPlus,
  Search,
  AlertCircle,
  X,
  Crown,
  Code2,
  MapPin,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";

export default function CommunityPage() {
  const { currentUser, organizations, projects } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const communities = useMemo(() => {
    return organizations.map((organization) => {
      const communityProjects = projects.filter(
        (project) => project.organizationId === organization.id
      );

      const skills = [
        ...new Set(
          communityProjects.flatMap(
            (project) => project.requiredSkills || []
          )
        ),
      ];

      const activeProjects = communityProjects.filter(
        (project) =>
          project.status === "Recruiting" ||
          project.status === "In Progress"
      );

      return {
        id: organization.id,
        name: organization.name,
        type: organization.type,
        logo: organization.logo,
        cover: organization.cover,
        topic: skills.slice(0, 4),
        description:
          organization.description ||
          organization.tagline ||
          "Community information is available through the existing project system.",
        tagline: organization.tagline,
        location: organization.location,
        projects: communityProjects,
        activeProjects,
      };
    });
  }, [organizations, projects]);

  const filteredCommunities = communities.filter((community) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      community.name.toLowerCase().includes(search) ||
      community.type?.toLowerCase().includes(search) ||
      community.topic.some((topic) =>
        topic.toLowerCase().includes(search)
      )
    );
  });

  const openCommunity = (community) => {
    setSelectedCommunity(community);
  };

  const closeCommunity = () => {
    setSelectedCommunity(null);
  };

  const openProject = (projectId) => {
    navigate(`/projects/${projectId}`);
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
          <span>Skill Community</span>
        </div>

        <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Find Your Community
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Discover people, skills and projects connected through the
              existing NEXORA project system.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search communities or skills..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>
      </div>

      {/* Backend limitation */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-xs text-amber-300 leading-relaxed">
          Community membership is not currently available from the backend.
          The community discovery below uses the existing organization and
          project data. No fake membership or Join state is created.
        </p>
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

      {/* Community List */}
      {filteredCommunities.length > 0 && (
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Communities
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Explore skill-focused organizations and their projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col"
              >
                {/* Community Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-950/40">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      {community.logo ? (
                        <img
                          src={community.logo}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-emerald-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-white truncate">
                        {community.name}
                      </h2>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {community.type || "Skill community"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Content */}
                <div className="p-5 flex-1 space-y-5">
                  {/* Topic */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Skill / Topic
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
                          Skill information unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Leader */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Community Leader
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <Crown className="w-4 h-4 text-amber-400" />

                      <span className="text-sm text-slate-400">
                        Leader data unavailable
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1">
                      Leadership information is not provided by the current
                      backend.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Description
                    </span>

                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      {community.description}
                    </p>
                  </div>

                  {/* Location */}
                  {community.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{community.location}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                    <div className="text-center">
                      <Users className="w-4 h-4 text-slate-500 mx-auto mb-1" />

                      <p className="text-sm font-bold text-slate-400">
                        —
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
                        {community.activeProjects.length}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    disabled
                    title="Community Join API is not available"
                    className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Join unavailable
                  </button>

                  <button
                    onClick={() => openCommunity(community)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-1"
                  >
                    <span>View Community</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Existing Project System */}
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
              Projects connected to the communities above.
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

      {/* Community Details Modal */}
      {selectedCommunity && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 p-5 sm:p-6 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                    {selectedCommunity.logo ? (
                      <img
                        src={selectedCommunity.logo}
                        alt={selectedCommunity.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {selectedCommunity.name}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      {selectedCommunity.type || "Skill community"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCommunity}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close community details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-7">
              {/* Overview */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-5 h-5 text-emerald-400" />

                  <h3 className="text-lg font-bold text-white">
                    Overview
                  </h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {selectedCommunity.description}
                </p>

                {selectedCommunity.topic.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedCommunity.topic.map((topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 rounded-lg text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Members */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-emerald-400" />

                  <h3 className="text-lg font-bold text-white">
                    Members
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <p className="text-sm text-slate-400">
                    Community member data is not currently available from
                    the backend.
                  </p>

                  <p className="text-xs text-slate-600 mt-2">
                    No fake member list or membership count is displayed.
                  </p>
                </div>
              </section>

              {/* Projects */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <FolderKanban className="w-5 h-5 text-emerald-400" />

                  <h3 className="text-lg font-bold text-white">
                    Projects
                  </h3>
                </div>

                {selectedCommunity.projects.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                    <p className="text-sm text-slate-400">
                      No projects are connected to this community.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCommunity.projects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
                      >
                        <h4 className="text-sm font-bold text-white">
                          {project.title}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1">
                          {project.tagline}
                        </p>

                        <div className="flex items-center justify-between gap-3 mt-4">
                          <span className="text-[11px] text-emerald-400">
                            {project.status}
                          </span>

                          <button
                            onClick={() => openProject(project.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                          >
                            Open Project
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Activity */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-emerald-400" />

                  <h3 className="text-lg font-bold text-white">
                    Activity
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  {selectedCommunity.activeProjects.length > 0 ? (
                    <>
                      <p className="text-sm text-slate-300">
                        {selectedCommunity.activeProjects.length} active
                        project
                        {selectedCommunity.activeProjects.length !== 1
                          ? "s"
                          : ""}{" "}
                        connected to this community.
                      </p>

                      <div className="mt-3 space-y-2">
                        {selectedCommunity.activeProjects
                          .slice(0, 5)
                          .map((project) => (
                            <div
                              key={project.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                  {project.title}
                                </p>

                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {project.status}
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  openProject(project.id)
                                }
                                className="shrink-0 text-xs text-emerald-400 hover:text-emerald-300"
                              >
                                Open
                              </button>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No active project activity is currently available.
                    </p>
                  )}
                </div>
              </section>

              {/* Join */}
              <section>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-400" />

                    <h3 className="text-sm font-bold text-amber-300">
                      Join Community
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Joining is currently unavailable because the backend
                    does not expose a Community membership endpoint.
                    No local or fake membership state is created.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}