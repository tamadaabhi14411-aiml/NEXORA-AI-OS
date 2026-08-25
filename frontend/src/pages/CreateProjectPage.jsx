import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SDGBadge from "../components/ui/SDGBadge";
import { PlusCircle, Sparkles, Target, Layers, ArrowRight, Check } from "lucide-react";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { sdgList, organizations, createProject, currentUser } = useApp();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "org_1");
  const [location, setLocation] = useState("Remote / Global");
  const [impactGoal, setImpactGoal] = useState("");
  const [selectedSdgs, setSelectedSdgs] = useState([13]);
  
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(["React", "Python", "Node.js"]);

  const [roleTitle, setRoleTitle] = useState("");
  const [openRoles, setOpenRoles] = useState([
    { role: "Frontend Developer (React)", skillsNeeded: ["React", "Tailwind CSS"], description: "Help build the user-facing web dashboard." }
  ]);

  const handleToggleSdg = (sdgId) => {
    setSelectedSdgs((prev) =>
      prev.includes(sdgId) ? prev.filter((id) => id !== sdgId) : [...prev, sdgId]
    );
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (roleTitle.trim()) {
      setOpenRoles([
        ...openRoles,
        { role: roleTitle.trim(), skillsNeeded: skills.slice(0, 2), description: "Help contribute technical skills to this initiative." }
      ]);
      setRoleTitle("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || selectedSdgs.length === 0) return;

    const org = organizations.find((o) => o.id === organizationId);

    const newId = createProject({
      title,
      tagline: tagline || title,
      description,
      organizationId,
      organizationName: org ? org.name : "EcoCode Initiative",
      location,
      impactGoal: impactGoal || "Empower sustainable development through collaborative tech.",
      sdgs: selectedSdgs,
      requiredSkills: skills,
      openRoles
    });

    navigate(`/project/${newId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <PlusCircle className="w-4 h-4" />
          <span>Submit a Sustainable Tech Project</span>
        </div>
        <h1 className="text-3xl font-black text-white">Create New Project</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Publish your project to recruit developers, researchers, and volunteers using skill-based collaborator matching.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            1. Basic Project Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI Solar Microgrid Telemetry Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Tagline
            </label>
            <input
              type="text"
              placeholder="e.g. Open source telemetry software for community solar grids"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hosting Organization
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location / Remote
              </label>
              <input
                type="text"
                placeholder="e.g. Nairobi, Kenya / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Description & Problem Statement *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what your project builds, who it serves, and why technical collaborators are needed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Measurable Impact Goal
            </label>
            <input
              type="text"
              placeholder="e.g. Provide clean water telemetry to 50 rural villages by Q4 2026."
              value={impactGoal}
              onChange={(e) => setImpactGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Section 2: UN SDG Alignment */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              2. UN SDG Goal Alignment *
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              Selected: {selectedSdgs.length} Goal(s)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {sdgList.map((sdg) => {
              const isSelected = selectedSdgs.includes(sdg.id);
              return (
                <div
                  key={sdg.id}
                  onClick={() => handleToggleSdg(sdg.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 text-white shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-5 h-5 rounded text-[10px] font-black text-white flex items-center justify-center shrink-0"
                      style={{ backgroundColor: sdg.color }}
                    >
                      {sdg.number}
                    </span>
                    <span className="truncate">{sdg.title}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Required Tech Stack & Skills */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            3. Required Tech Stack & Skills
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. React, Python, Docker, GIS Mapping)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddSkill}
              type="button"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 text-slate-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-900/30 flex items-center gap-2 hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Publish Project & Find Teammates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
