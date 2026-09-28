import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  TrendingUp,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import CommunityCard from "../components/community/CommunityCard";

export default function CommunityPage() {
  const { currentUser, organizations } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("For You");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    skill: "",
  });

  const communities = useMemo(() => {
    return (organizations || []).map((organization) => ({
      id: organization.id,
      name: organization.name,
      skill: organization.type || "Skill community",
      description:
        organization.description ||
        organization.tagline ||
        "Learn together, share knowledge and build projects with other learners.",
      memberCount: null,
      creator: null,
    }));
  }, [organizations]);

  const filteredCommunities = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return communities;
    }

    return communities.filter((community) => {
      return (
        community.name?.toLowerCase().includes(search) ||
        community.skill?.toLowerCase().includes(search) ||
        community.description?.toLowerCase().includes(search)
      );
    });
  }, [communities, searchTerm]);

  const handleViewCommunity = (community) => {
    navigate(`/community/${community.id}`);
  };

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateCommunity = (event) => {
    event.preventDefault();

    // Community creation is intentionally blocked because
    // the current backend does not provide a Community API.
    return;
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
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

  const tabs = [
    {
      name: "For You",
      icon: Sparkles,
    },
    {
      name: "Trending",
      icon: TrendingUp,
    },
    {
      name: "My Communities",
      icon: Users,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/20 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              Community
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">
              Find people who know what you want to learn.
            </h1>

            <p className="text-sm text-slate-400 max-w-2xl mt-3 leading-relaxed">
              Discover skill-focused communities, connect with learners and
              grow together.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="shrink-0 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Community
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mt-7">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </section>

      {/* Backend Notice */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs text-amber-300 leading-relaxed">
          Community management features are currently unavailable because the
          backend does not provide Community APIs yet. Existing organization
          data is shown only for discovery. No fake members, posts, joins, or
          community counts are created.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                isActive
                  ? "bg-purple-600/15 text-purple-300 border border-purple-500/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Communities */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-black text-white">
              {activeTab}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Explore communities available in the current frontend data.
            </p>
          </div>

          <span className="text-xs text-slate-600">
            {filteredCommunities.length} communities
          </span>
        </div>

        {filteredCommunities.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center">
            <Users className="w-10 h-10 text-slate-700 mx-auto mb-4" />

            <h3 className="text-lg font-bold text-white">
              No communities yet.
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                onView={handleViewCommunity}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Community Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Create Community
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Create a skill-focused learning community.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors"
                aria-label="Close create community form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateCommunity}
              className="p-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="community-name"
                  className="block text-xs font-semibold text-slate-300 mb-2"
                >
                  Community Name
                </label>

                <input
                  id="community-name"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  placeholder="e.g. Python Builders"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label
                  htmlFor="community-description"
                  className="block text-xs font-semibold text-slate-300 mb-2"
                >
                  Description
                </label>

                <textarea
                  id="community-description"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateFormChange}
                  placeholder="What is this community about?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="community-skill"
                  className="block text-xs font-semibold text-slate-300 mb-2"
                >
                  Skill
                </label>

                <input
                  id="community-skill"
                  name="skill"
                  value={createForm.skill}
                  onChange={handleCreateFormChange}
                  placeholder="e.g. Python"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50"
                />
              </div>

              {/* API unavailable notice */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs text-amber-300 leading-relaxed">
                  Community creation is currently unavailable because the
                  backend does not provide a Create Community API. Your form
                  data will not be submitted or stored.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled
                  title="Create Community API is not available"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-600 text-sm font-semibold cursor-not-allowed"
                >
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}