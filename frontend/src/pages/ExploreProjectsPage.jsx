import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";
import {
  Search,
  Filter,
  Sparkles,
  PlusCircle,
  RefreshCw,
  Layers,
  Building2,
  ArrowLeft,
} from "lucide-react";

export default function ExploreProjectsPage() {
  const {
    projects,
    sdgList,
    currentUser,
    organizations,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialSdg = searchParams.get("sdg") || "";
  const initialSkill = searchParams.get("skill") || "";
  const organizationId = searchParams.get("organizationId") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSdg, setSelectedSdg] = useState(initialSdg);
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("match");

  /*
   * Find the selected organization/community.
   */
  const selectedOrganization = useMemo(() => {
    if (!organizationId) return null;

    return (
      organizations.find(
        (organization) => organization.id === organizationId
      ) || null
    );
  }, [organizations, organizationId]);

  /*
   * Get projects for the selected organization.
   *
   * If organizationId is present:
   *   show only projects belonging to that organization.
   *
   * Otherwise:
   *   show all projects as before.
   */
  const organizationProjects = useMemo(() => {
    if (!organizationId) {
      return projects;
    }

    return projects.filter(
      (project) => project.organizationId === organizationId
    );
  }, [projects, organizationId]);

  /*
   * Unique list of required skills.
   */
  const allSkills = useMemo(() => {
    const skillsSet = new Set();

    organizationProjects.forEach((project) => {
      (project.requiredSkills || []).forEach((skill) => {
        skillsSet.add(skill);
      });
    });

    return Array.from(skillsSet).sort();
  }, [organizationProjects]);

  /*
   * Apply search and filters.
   */
  const filteredProjects = useMemo(() => {
    return organizationProjects.filter((project) => {
      const title = project.title || "";
      const tagline = project.tagline || "";
      const description = project.description || "";
      const organizationName = project.organizationName || "";

      // Search term
      const matchesSearch =
        searchTerm === "" ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizationName.toLowerCase().includes(searchTerm.toLowerCase());

      // SDG filter
      const matchesSdg =
        selectedSdg === "" ||
        (project.sdgs || []).includes(Number(selectedSdg));

      // Skill filter
      const matchesSkill =
        selectedSkill === "" ||
        (project.requiredSkills || []).some(
          (skill) =>
            skill.toLowerCase() === selectedSkill.toLowerCase()
        );

      // Status filter
      const matchesStatus =
        selectedStatus === "" ||
        project.status === selectedStatus;

      return (
        matchesSearch &&
        matchesSdg &&
        matchesSkill &&
        matchesStatus
      );
    });
  }, [
    organizationProjects,
    searchTerm,
    selectedSdg,
    selectedSkill,
    selectedStatus,
  ]);

  /*
   * Reset only the filters while preserving
   * the Community → Projects organization filter.
   */
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSdg("");
    setSelectedSkill("");
    setSelectedStatus("");

    if (organizationId) {
      setSearchParams({
        organizationId,
      });
    } else {
      setSearchParams({});
    }
  };

  /*
   * If an organizationId was supplied but the organization
   * doesn't exist, show a clear empty/error-style state.
   */
  if (organizationId && !selectedOrganization) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />

          <h2 className="text-xl font-bold text-white">
            Community not found
          </h2>

          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            The selected community is unavailable. Please return to
            Community and choose another community.
          </p>

          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">

        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />

            <span>
              {selectedOrganization
                ? "Community Projects"
                : "Open Source Sustainable Development Initiatives"}
            </span>
          </div>

          <h1 className="text-3xl font-black text-white mt-1">
            {selectedOrganization
              ? `${selectedOrganization.name} Projects`
              : "Explore Sustainable Projects"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {selectedOrganization
              ? `Explore projects associated with ${selectedOrganization.name} and find opportunities to contribute your technical skills.`
              : "Discover projects aligned with the 17 UN SDGs and find opportunities to contribute your technical skills."}
          </p>
        </div>

        <Link
          to="/create-project"
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Community Context */}
      {selectedOrganization && (
        <div className="glass-panel rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-emerald-400">
                Community
              </p>

              <p className="text-sm font-bold text-white">
                {selectedOrganization.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

          <input
            type="text"
            placeholder="Search by project name, tech stack, description, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">

          {/* SDG Select */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              SDG Goal:
            </label>

            <select
              value={selectedSdg}
              onChange={(e) => setSelectedSdg(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All 17 SDGs</option>

              {sdgList.map((sdg) => (
                <option key={sdg.id} value={sdg.id}>
                  SDG {sdg.number}: {sdg.title}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Select */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Required Skill:
            </label>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Tech Skills</option>

              {allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Project Status:
            </label>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="Recruiting">Recruiting</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Sort Results:
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="match">
                Highest Match % for You
              </option>

              <option value="recent">
                Most Recent
              </option>

              <option value="team">
                Team Size
              </option>
            </select>
          </div>
        </div>

        {/* Active Filter Pills */}
        {(selectedSdg ||
          selectedSkill ||
          selectedStatus ||
          searchTerm) && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400 font-semibold">
                Active filters:
              </span>

              {selectedSdg && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  SDG #{selectedSdg}
                </span>
              )}

              {selectedSkill && (
                <span className="px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-500/40">
                  Skill: {selectedSkill}
                </span>
              )}

              {selectedStatus && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  Status: {selectedStatus}
                </span>
              )}

              {searchTerm && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  Search: {searchTerm}
                </span>
              )}
            </div>

            <button
              onClick={resetFilters}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">

        <div>
          Showing{" "}
          <span className="font-bold text-white">
            {filteredProjects.length}
          </span>{" "}
          {selectedOrganization
            ? `project${filteredProjects.length !== 1 ? "s" : ""} in this community`
            : "projects"}
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />

          <span>
            Match scores calculated for {currentUser.name}
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">

          <Filter className="w-12 h-12 text-slate-600 mx-auto" />

          <h3 className="text-lg font-bold text-white">
            {selectedOrganization
              ? "No projects found in this community"
              : "No projects found matching criteria"}
          </h3>

          <p className="text-xs text-slate-400">
            {selectedOrganization
              ? "This community currently has no projects matching your selected filters."
              : "Try loosening your search query or reset filters."}
          </p>

          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showMatchScore={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}