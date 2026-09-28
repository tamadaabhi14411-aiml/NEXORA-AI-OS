import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  Users,
  UserPlus,
  CheckCircle2,
  Clock3,
  Circle,
  Plus,
  AlertCircle,
  Loader2,
  Target,
} from "lucide-react";
import projectService from "../services/projectService";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState("");

  const loadProject = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await projectService.getProject(projectId);
      setProject(data);
    } catch (err) {
      setError(err?.message || "Unable to load project.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleJoinProject = async () => {
    setIsJoining(true);
    setError("");

    try {
      await projectService.joinProject(projectId);
      setIsJoined(true);
    } catch (err) {
      setError(err?.message || "Unable to join project.");
    } finally {
      setIsJoining(false);
    }
  };

  const tasks = project?.tasks || [];
  const members = project?.members || [];

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : Number(project?.progress || 0);

  const status = project?.status || "Status unavailable";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          Loading project...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        {/* Error / unavailable */}
        {error && !project && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>

            <h1 className="text-xl font-bold text-white mt-5">
              Unable to load project.
            </h1>

            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-3">
              {error}
            </p>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="mt-6 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        )}

        {project && (
          <>
            {/* Project Header */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                    <FolderKanban className="w-4 h-4" />
                    Collaborative Project
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white">
                      {project.title || project.name || "Project"}
                    </h1>

                    <p className="text-sm text-slate-400 mt-3 max-w-3xl leading-relaxed">
                      {project.description || "Description unavailable."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
                      Skill: {project.skill || "Unavailable"}
                    </span>

                    <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
                      Community: {project.community || project.communityName || "Unavailable"}
                    </span>

                    <span className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                      Status: {status}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isJoined ? (
                    <button
                      type="button"
                      disabled
                      className="w-full lg:w-auto px-5 py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Joined
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleJoinProject}
                      disabled={isJoining}
                      className="w-full lg:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all"
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Joining project...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Join Project
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Owner + Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <section className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Target className="w-4 h-4 text-purple-400" />
                  Project Owner
                </div>

                <div className="mt-5">
                  <p className="text-base font-semibold text-white">
                    {project.owner?.name ||
                      project.ownerName ||
                      "Owner information unavailable"}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {project.owner?.role || "Project Owner"}
                  </p>
                </div>
              </section>

              <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Project Progress
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {completedTasks} / {tasks.length} completed tasks
                    </p>
                  </div>

                  <span className="text-2xl font-black text-purple-400">
                    {progress}%
                  </span>
                </div>

                <div className="mt-5 h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </section>
            </div>

            {/* Members */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Project Members
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    People collaborating on this project.
                  </p>
                </div>

                <span className="text-xs text-slate-500">
                  {members.length} members
                </span>
              </div>

              {members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {members.map((member) => (
                    <div
                      key={member.id || member.userId}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
                          {(member.name || "?").charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {member.name || "Member"}
                          </p>

                          <p className="text-xs text-purple-400 mt-1">
                            {member.role || "Member"}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-3">
                        {Array.isArray(member.skills)
                          ? member.skills.join(" • ")
                          : member.skills || "Skills unavailable"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
                  <Users className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 mt-3">
                    Member data unavailable.
                  </p>
                </div>
              )}
            </section>

            {/* Tasks */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Project Tasks
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Track work from Todo to In Progress to Completed.
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  title="Project Task API is not available"
                  className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-600 text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-3 mt-6">
                  {tasks.map((task) => (
                    <div
                      key={task.id || task._id}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {task.title || "Task"}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {task.description || "Description unavailable."}
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-slate-300">
                        {task.status || "Todo"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
                  <Clock3 className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 mt-3">
                    Task data unavailable.
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Task creation and updates require Project Task APIs.
                  </p>
                </div>
              )}
            </section>

            {/* Completion */}
            {status.toLowerCase() === "completed" && (
              <section className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-7 h-7 text-green-400 shrink-0" />

                  <div>
                    <h2 className="text-xl font-black text-white">
                      Project Completed
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                      Skill: {project.skill || "Unavailable"}
                    </p>

                    <p className="text-sm text-slate-400">
                      Community: {project.community || project.communityName || "Unavailable"}
                    </p>

                    <p className="text-sm text-slate-400">
                      Members: {members.length}
                    </p>

                    <p className="text-xs text-slate-600 mt-3">
                      This project completion can become future verified skill
                      proof. No badge or verification system is implemented in
                      Day 17.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Backend error when project object exists */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />

                <p className="text-xs text-red-300">
                  {error}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
