import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SDGBadge from "../components/ui/SDGBadge";
import {
  Kanban,
  CheckCircle2,
  Clock,
  PlusCircle,
  Users,
  Megaphone,
  BarChart2,
  Sparkles,
  ArrowRight,
  Send,
  Globe
} from "lucide-react";

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    currentUser,
    addTaskToProject,
    updateTaskStatus,
    addProjectAnnouncement
  } = useApp();

  const [activeTab, setActiveTab] = useState("board"); // 'board', 'team', 'announcements', 'metrics'

  // Modal states for adding task & announcement
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState(currentUser.name);
  const [taskPriority, setTaskPriority] = useState("High");

  const [isAddAnnOpen, setIsAddAnnOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");

  const project = projects.find((p) => p.id === id) || projects[0];

  const todoTasks = project.tasks.filter((t) => t.status === "To Do");
  const inProgressTasks = project.tasks.filter((t) => t.status === "In Progress");
  const completedTasks = project.tasks.filter((t) => t.status === "Completed");

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTaskToProject(project.id, {
      title: taskTitle.trim(),
      assignee: taskAssignee,
      status: "To Do",
      priority: taskPriority,
      dueDate: "2026-08-30"
    });
    setTaskTitle("");
    setIsAddTaskOpen(false);
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addProjectAnnouncement(project.id, annTitle.trim(), annContent.trim());
    setAnnTitle("");
    setAnnContent("");
    setIsAddAnnOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Workspace Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                Project Workspace
              </span>
              <span className="text-xs text-slate-400">• {project.organizationName}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">{project.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{project.tagline}</p>
          </div>

          {/* Project Switcher Select */}
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Switch Workspace:
            </span>
            <select
              value={project.id}
              onChange={(e) => navigate(`/workspace/${e.target.value}`)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SDGs & Quick Action Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {project.sdgs.map((sdgId) => (
              <SDGBadge key={sdgId} sdgId={sdgId} size="sm" showLabel={true} />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/collaborators?projectId=${project.id}`}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Teammates</span>
            </Link>
            <Link
              to={`/project/${project.id}`}
              className="text-xs text-slate-400 hover:text-white"
            >
              View Details Page →
            </Link>
          </div>
        </div>

      </div>

      {/* Workspace Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "board"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Task Board ({project.tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "team"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Roster ({project.team.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "announcements"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcements ({project.announcements ? project.announcements.length : 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "metrics"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>SDG Impact Metrics</span>
          </button>
        </div>

        {activeTab === "board" && (
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {/* TAB 1: KANBAN TASK BOARD */}
      {activeTab === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: To Do */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                To Do
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                {todoTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {todoTasks.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-950/60 text-amber-300 font-bold border border-amber-500/30">
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    <span>Assignee: {t.assignee}</span>
                    <button
                      onClick={() => updateTaskStatus(project.id, t.id, "In Progress")}
                      className="text-[10px] text-emerald-400 hover:underline font-semibold"
                    >
                      Move to In Progress →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                In Progress
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 text-[10px] font-bold">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressTasks.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-950 text-teal-300 font-bold border border-teal-500/30">
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    <span>Assignee: {t.assignee}</span>
                    <button
                      onClick={() => updateTaskStatus(project.id, t.id, "Completed")}
                      className="text-[10px] text-emerald-400 hover:underline font-semibold"
                    >
                      Mark Complete ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Completed
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                {completedTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {completedTasks.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 opacity-90">
                  <h4 className="text-xs font-bold text-slate-300 line-through">{t.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                    <span>Done by: {t.assignee}</span>
                    <span className="text-emerald-400 font-bold">✓ Complete</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TEAM ROSTER */}
      {activeTab === "team" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.team.map((member) => (
            <div key={member.userId} className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-white">{member.name}</h4>
                  <p className="text-xs text-emerald-400">{member.role}</p>
                </div>
              </div>
              <Link
                to={`/user/${member.userId}`}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:text-white font-semibold"
              >
                Profile
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Project Updates & Bulletins</h3>
            <button
              onClick={() => setIsAddAnnOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Update</span>
            </button>
          </div>

          <div className="space-y-4">
            {(!project.announcements || project.announcements.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs glass-panel rounded-2xl">
                No announcements posted yet.
              </div>
            ) : (
              project.announcements.map((ann) => (
                <div key={ann.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="font-bold text-emerald-400">{ann.author}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: METRICS */}
      {activeTab === "metrics" && (
        <div className="space-y-6 max-w-3xl">
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-950 space-y-3">
            <h3 className="text-base font-bold text-white">Target SDG Impact Goal</h3>
            <p className="text-sm text-slate-300 font-medium">{project.impactGoal}</p>
          </div>

          {project.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(project.metrics).map(([key, val]) => (
                <div key={key} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-2xl font-black text-emerald-400">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Add Task */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Add Task to Workspace</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Build React component for pH readout"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {project.team.map((m) => (
                    <option key={m.userId} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Announcement */}
      {isAddAnnOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Post Project Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAnnOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
