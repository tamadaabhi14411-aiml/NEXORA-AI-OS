import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, Sparkles, Send, CheckCircle2 } from "lucide-react";

export default function ConnectModal({ user, project, matchPercentage = 88, onClose }) {
  const { projects, sendCollaborationRequest, currentUser } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState(
    project ? project.id : (projects[0]?.id || "proj_1")
  );
  const [roleApplied, setRoleApplied] = useState("Frontend / Full-Stack Developer");
  const [message, setMessage] = useState(
    `Hi ${user.name}! I reviewed your profile on SDG Connect and would love to invite you to collaborate on our sustainable tech project.`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeProject = projects.find(p => p.id === selectedProjectId) || project || projects[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    sendCollaborationRequest({
      projectId: activeProject.id,
      toUserId: user.id,
      roleApplied,
      message,
      matchPercentage
    });
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Send Collaboration Request</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Request Sent Successfully!</h4>
            <p className="text-xs text-slate-400">
              {user.name} has been notified. You can track this request on your User Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            
            {/* Recipient summary card */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name}</h4>
                  <p className="text-[11px] text-slate-400">{user.role}</p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40">
                {matchPercentage}% Match
              </div>
            </div>

            {/* Select Target Project */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Project:
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.organizationName})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proposed Role / Contribution:
              </label>
              <input
                type="text"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                placeholder="e.g. Lead React Developer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Personalized Invite Message:
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                required
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
