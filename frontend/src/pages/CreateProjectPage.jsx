import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  AlertCircle,
  Loader2,
} from "lucide-react";
import projectService from "../services/projectService";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const communityId = searchParams.get("communityId") || "";

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [skill, setSkill] = useState("");
  const [community, setCommunity] = useState(communityId);

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCommunity(communityId);
  }, [communityId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!projectName.trim() || !description.trim() || !skill.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const project = await projectService.createProject({
        name: projectName.trim(),
        title: projectName.trim(),
        description: description.trim(),
        skill: skill.trim(),
        communityId: community.trim(),
        community: community.trim(),
      });

      const projectId = project?.id || project?._id;

      if (!projectId) {
        setError("Project was created, but no project ID was returned.");
        return;
      }

      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to create project."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            communityId
              ? navigate(`/community/${communityId}`)
              : navigate("/projects")
          }
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <FolderKanban className="w-4 h-4" />
            Collaborative Project
          </div>

          <h1 className="text-3xl font-black text-white mt-3">
            Create Project
          </h1>

          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Create a collaborative project for your community and build
            practical skill experience with other members.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6"
        >
          {/* Project Name */}
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              Project Name
            </label>

            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Enter project name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="project-description"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              Description
            </label>

            <textarea
              id="project-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what the project will build..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Skill */}
          <div>
            <label
              htmlFor="project-skill"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              Skill
            </label>

            <input
              id="project-skill"
              type="text"
              value={skill}
              onChange={(event) => setSkill(event.target.value)}
              placeholder="e.g. Python, React, Machine Learning"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Community */}
          <div>
            <label
              htmlFor="project-community"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              Community
            </label>

            <input
              id="project-community"
              type="text"
              value={community}
              onChange={(event) => setCommunity(event.target.value)}
              placeholder="Community ID"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />

            {communityId && (
              <p className="text-xs text-purple-400 mt-2">
                Community selected from the community page.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-red-300">
                  Unable to create project.
                </p>

                <p className="text-xs text-red-300/70 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-3 text-sm font-semibold text-white transition-all"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating project...
              </>
            ) : (
              <>
                <FolderKanban className="w-4 h-4" />
                Create Project
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
