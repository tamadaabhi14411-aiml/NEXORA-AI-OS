import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Info,
  UserPlus,
  Crown,
  AlertCircle,
  Plus,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function CommunityDetailsPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { organizations } = useApp();

  const [activeTab, setActiveTab] = useState("About");

  const community = (organizations || []).find(
    (organization) => String(organization.id) === String(communityId)
  );

  if (!community) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-white">
            Community not found
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            This community is not available in the current frontend data.
          </p>

          <button
            type="button"
            onClick={() => navigate("/community")}
            className="mt-5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      name: "About",
      icon: Info,
    },
    {
      name: "Posts",
      icon: MessageSquare,
    },
    {
      name: "Members",
      icon: Users,
    },
  ];

  const description =
    community.description ||
    community.tagline ||
    "Learn together, share knowledge and build projects with other learners.";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/community")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Community
      </button>

      {/* Header */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/20 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-purple-400" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  {community.type || "Skill Community"}
                </p>

                <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {community.name}
                </h1>

                <p className="text-sm text-slate-400 mt-3 max-w-2xl leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              title="Join Community API is not available"
              className="shrink-0 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-500 text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              Join unavailable
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-7">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <Users className="w-4 h-4 text-purple-400 mb-2" />

              <p className="text-lg font-bold text-slate-400">
                —
              </p>

              <p className="text-xs text-slate-600">
                Members
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <Crown className="w-4 h-4 text-amber-400 mb-2" />

              <p className="text-sm font-bold text-slate-400">
                Unavailable
              </p>

              <p className="text-xs text-slate-600">
                Community Leader
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 col-span-2 sm:col-span-1">
              <Info className="w-4 h-4 text-blue-400 mb-2" />

              <p className="text-sm font-bold text-slate-400">
                Skill Community
              </p>

              <p className="text-xs text-slate-600">
                Community Type
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 sm:px-8 border-t border-slate-800 flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                  isActive
                    ? "text-purple-300 border-purple-500"
                    : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Backend Notice */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs text-amber-300 leading-relaxed">
          Community backend APIs are not available yet. Membership, posts,
          members and community creation are therefore shown as unavailable
          instead of using fake data.
        </p>
      </div>

      {/* About */}
      {activeTab === "About" && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-purple-400" />

              <h2 className="text-xl font-bold text-white">
                About
              </h2>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-400" />

              <h2 className="text-xl font-bold text-white">
                Community Leader
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Leader information is unavailable from the current backend.
            </p>
          </div>
        </section>
      )}

      {/* Posts */}
      {activeTab === "Posts" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />

                <h2 className="text-xl font-bold text-white">
                  Community Posts
                </h2>
              </div>

              <p className="text-sm text-slate-500 mt-1">
                Be the first person to share something.
              </p>
            </div>

            <button
              type="button"
              disabled
              title="Community Post API is not available"
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-3" />

            <p className="text-sm text-slate-500">
              No posts yet.
            </p>

            <p className="text-xs text-slate-700 mt-1">
              Community post data is unavailable from the backend.
            </p>
          </div>
        </section>
      )}

      {/* Members */}
      {activeTab === "Members" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />

            <h2 className="text-xl font-bold text-white">
              Community Members
            </h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center">
            <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />

            <p className="text-sm text-slate-500">
              No members yet.
            </p>

            <p className="text-xs text-slate-700 mt-1">
              Member data is unavailable from the backend.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}