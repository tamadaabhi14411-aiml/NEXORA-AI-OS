import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";
import SDGBadge from "../components/ui/SDGBadge";
import {
  LayoutDashboard,
  Kanban,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  Bell,
  Sparkles,
  PlusCircle,
  Users,
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function UserDashboardPage() {
  const {
    currentUser,
    projects,
    requests,
    updateRequestStatus,
    savedProjects,
    notifications,
    markNotificationRead
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'requests', 'projects', 'saved'

  // Filter requests targeting currentUser or sent by currentUser
  const incomingRequests = requests.filter((r) => r.toUserId === currentUser.id);
  const outgoingRequests = requests.filter((r) => r.fromUserId === currentUser.id);

  // Projects member of
  const myProjects = projects.filter((p) =>
    p.team.some((m) => m.userId === currentUser.id)
  );

  // Bookmarked projects
  const bookmarkedList = projects.filter((p) => savedProjects.includes(p.id));

  // Assigned tasks
  const myTasks = myProjects.flatMap((p) =>
    p.tasks.filter((t) => t.assignee.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Welcome back, {currentUser.name}!</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage your sustainable projects, collaboration requests, and workspace deliverables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/collaborators"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Match Teammates</span>
          </Link>

          <Link
            to="/create-project"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Project</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveTab("projects")}
          className="glass-card rounded-2xl p-5 border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>My Active Projects</span>
            <Kanban className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{myProjects.length}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Joined or created</span>
        </div>

        <div
          onClick={() => setActiveTab("requests")}
          className="glass-card rounded-2xl p-5 border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Pending Requests</span>
            <MessageSquare className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {incomingRequests.filter((r) => r.status === "pending").length}
          </div>
          <span className="text-[10px] text-teal-400 font-medium">Requires your action</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Assigned Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{myTasks.length}</div>
          <span className="text-[10px] text-slate-400">Across active workspaces</span>
        </div>

        <div
          onClick={() => setActiveTab("saved")}
          className="glass-card rounded-2xl p-5 border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Bookmarked Projects</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{bookmarkedList.length}</div>
          <span className="text-[10px] text-amber-400 font-medium">Saved for later</span>
        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "overview"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Overview & Requests ({incomingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "projects"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          My Projects ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "saved"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Saved Projects ({bookmarkedList.length})
        </button>
      </div>

      {/* Overview & Requests Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Incoming Requests */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Incoming Teammate / Join Requests</span>
              <span className="text-xs text-slate-400 font-normal">{incomingRequests.length} total</span>
            </h3>

            {incomingRequests.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 text-xs">
                No incoming collaboration requests right now.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.fromUserAvatar}
                          alt={req.fromUserName}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{req.fromUserName}</h4>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              {req.matchPercentage}% Match
                            </span>
                          </div>
                          <p className="text-xs text-emerald-400">{req.fromUserRole}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Applied for: <span className="text-slate-200 font-semibold">{req.roleApplied}</span> on{" "}
                            <span className="text-slate-200 font-semibold">{req.projectTitle}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">{req.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      "{req.message}"
                    </p>

                    {/* Action Buttons: Accept / Decline */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        {req.status === "pending" ? (
                          <>
                            <button
                              onClick={() => updateRequestStatus(req.id, "accepted")}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Request</span>
                            </button>
                            <button
                              onClick={() => updateRequestStatus(req.id, "declined")}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              req.status === "accepted"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            Status: {req.status.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/user/${req.fromUserId}`}
                        className="text-xs text-slate-400 hover:text-emerald-400 hover:underline"
                      >
                        View Teammate Profile →
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Outgoing requests sent */}
            <div className="pt-6">
              <h3 className="text-sm font-bold text-slate-300 mb-3">Outgoing Applications Sent ({outgoingRequests.length})</h3>
              <div className="space-y-2">
                {outgoingRequests.map((req) => (
                  <div key={req.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-semibold">Application for {req.projectTitle}</span>
                      <span className="text-slate-400 block text-[11px]">Role: {req.roleApplied}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium text-[11px]">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Notification Feed & Tasks */}
          <div className="space-y-6">
            
            {/* Notification Feed */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  Notifications
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Real-time Feed</span>
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer ${
                      !n.read
                        ? "bg-emerald-950/20 border-emerald-500/40 text-slate-200"
                        : "bg-slate-950 border-slate-800/80 text-slate-400"
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{n.title}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[9px] text-slate-500 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Active Tasks */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>My Workspace Deliverables</span>
              </h3>

              <div className="space-y-2">
                {myTasks.length === 0 ? (
                  <p className="text-xs text-slate-500">No active tasks assigned.</p>
                ) : (
                  myTasks.map((t) => (
                    <div key={t.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <span className="font-medium text-slate-200 truncate max-w-[180px]">{t.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                        {t.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* My Projects Tab */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showMatchScore={false} />
          ))}
        </div>
      )}

      {/* Bookmarked Tab */}
      {activeTab === "saved" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedList.length === 0 ? (
            <div className="col-span-full glass-panel p-8 text-center text-slate-400 text-xs">
              No saved projects yet. Click the bookmark icon on any project to save it here.
            </div>
          ) : (
            bookmarkedList.map((project) => (
              <ProjectCard key={project.id} project={project} showMatchScore={true} />
            ))
          )}
        </div>
      )}

    </div>
  );
}
