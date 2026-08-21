import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";
import SDGBadge from "../components/ui/SDGBadge";
import {
  Globe,
  Sparkles,
  Users,
  Code2,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Layers,
  HeartHandshake,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const { projects, sdgList, users, organizations } = useApp();

  const featuredProjects = projects.slice(0, 3);

  const stats = [
    { label: "Active Collaborators", value: "1,240+", icon: Users, change: "+18% this month" },
    { label: "Sustainable Tech Projects", value: "145+", icon: Code2, change: "Across 24 countries" },
    { label: "UN SDGs Impacted", value: "All 17", icon: Target, change: "100% Coverage" },
    { label: "Tech Hours Contributed", value: "48,500+", icon: Zap, change: "Skill-based volunteer" }
  ];

  const steps = [
    {
      num: "01",
      title: "Discover Impact Initiatives",
      desc: "Browse vetted sustainable development projects filterable by tech stack, SDG goals, and urgency.",
      icon: Globe
    },
    {
      num: "02",
      title: "AI Skill & SDG Matcher",
      desc: "Our matching algorithm calculates your percentage overlap based on your programming skills and SDG interests.",
      icon: Sparkles
    },
    {
      num: "03",
      title: "Connect & Join Team",
      desc: "Send instant join requests to project leads, receive role invites, and join open-source development teams.",
      icon: HeartHandshake
    },
    {
      num: "04",
      title: "Build in Project Workspace",
      desc: "Manage tasks, share code repositories, post announcements, and measure verified environmental metrics.",
      icon: Layers
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        
        {/* Decorative background glow ambient spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Sustainable Development Technology Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Connect Technology. <br />
              <span className="text-gradient">Collaborate for a Sustainable Future.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Bridging developers, researchers, volunteers, NGOs, and green tech initiatives. Discover projects, match required skills with SDG interests, and build high-impact solutions together.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/collaborators"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Find Collaborators (Match AI)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/projects"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Explore Projects</span>
              </Link>
            </div>

            {/* Trust Badges / Organizations ticker */}
            <div className="pt-8 border-t border-slate-800/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="text-slate-400 font-semibold">Trusted by collaborators from:</span>
              <span className="text-slate-300 font-medium">MIT Earth Lab</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">EcoCode</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">AquaPure NGO</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">AgriConnect WA</span>
            </div>

          </div>

        </div>
      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Problem Card */}
          <div className="glass-card rounded-3xl p-8 border border-rose-500/20 bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-900/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">The Problem</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-3">
                “Lack of technological collaboration slows sustainable development initiatives.”
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Thousands of NGOs, university labs, and environmental projects struggle with limited software engineering bandwidth, while skilled developers lack direct channels to apply their technical skills to urgent SDG challenges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-rose-500/20 flex items-center gap-2 text-xs text-rose-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Siloed research & uncoordinated volunteer efforts create friction.</span>
            </div>
          </div>

          {/* Solution Card */}
          <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The SDG Connect Solution</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-3">
                Skill-Based Collaborator Matchmaking & Open SDG Workspaces
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A unified ecosystem connecting students, engineers, researchers, NGOs, and companies. Match required skills and SDG interests with precision algorithms, manage tasks in dedicated workspaces, and quantify global impact.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Accelerating SDG 17 (Partnerships) through open tech collaboration.</span>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORM STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-slate-800/80 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400">{item.label}</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{item.value}</div>
                <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{item.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Active Initiatives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Sustainable Tech Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All {projects.length} Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showMatchScore={true} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Streamlined Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How SDG Connect Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From discovering projects to submitting code and measuring SDG outcomes in 4 straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card rounded-2xl p-6 border border-slate-800 relative space-y-4 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-700">{step.num}</span>
                  <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* UN SDGs PREVIEW GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              UN Agenda 2030
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore Projects by SDG Goal
            </h2>
          </div>
          <Link to="/sdgs" className="text-xs font-semibold text-emerald-400 hover:underline">
            View All 17 Goals & Definitions →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sdgList.slice(0, 12).map((sdg) => (
            <Link
              key={sdg.id}
              to={`/projects?sdg=${sdg.id}`}
              className="glass-card rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center"
                  style={{ backgroundColor: sdg.color }}
                >
                  {sdg.number}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">SDG #{sdg.number}</span>
              </div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                {sdg.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* STRONG CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/40 bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-950 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ready to make a real impact?</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Start Matching with Sustainable Tech Teams Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join over 1,200 developers, data scientists, and designers contributing their skills to global SDG initiatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/collaborators"
              className="px-6 py-3.5 rounded-2xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Find Collaborators Now
            </Link>
            <Link
              to="/create-project"
              className="px-6 py-3.5 rounded-2xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
            >
              Post a Project
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
