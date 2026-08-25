import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Globe, Sparkles, CheckCircle2, UserCheck, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { users, loginUser, currentUser } = useApp();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("anjali.s@sdgconnect.org");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Developer");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Default login as Anjali or match user
    loginUser("usr_1");
    navigate("/dashboard");
  };

  const handleQuickLogin = (userId) => {
    loginUser(userId);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-center gap-12 min-h-[75vh]">
      
      {/* Left Column: Workshop Demo Notice & Quick Login Accounts */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>College Workshop Demo Sandbox</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Welcome to <span className="text-gradient">SDG Connect</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Select any verified persona below for instant 1-click workshop login, or sign in with your credentials.
        </p>

        {/* Preset Quick Login Buttons */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            1-Click Preset Demo Accounts:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users.slice(0, 6).map((u) => (
              <div
                key={u.id}
                onClick={() => handleQuickLogin(u.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  u.id === currentUser.id
                    ? "bg-emerald-950/40 border-emerald-500 text-white"
                    : "bg-slate-950/80 border-slate-800 hover:border-emerald-500/40 text-slate-200"
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                  <p className="text-[10px] text-emerald-400 truncate">{u.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Standard Auth Form */}
      <div className="w-full lg:w-1/2 max-w-md">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">
              {isSignup ? "Create SDG Connect Account" : "Sign In to Account"}
            </h2>
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-xs text-emerald-400 font-semibold hover:underline"
            >
              {isSignup ? "Have an account? Login" : "New user? Register"}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anjali Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Role Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Student">Student Developer</option>
                  <option value="Developer">Senior Software Engineer</option>
                  <option value="Researcher">Data Scientist / Researcher</option>
                  <option value="Volunteer">Sustainability Volunteer</option>
                  <option value="NGO">NGO Representative</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md flex items-center justify-center gap-2"
            >
              <span>{isSignup ? "Register & Enter Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local sandbox session — no password authentication needed</span>
          </div>

        </div>
      </div>

    </div>
  );
}
