import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Sparkles, Target, Layers, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What is SDG Connect?",
      a: "SDG Connect is an open-source collaboration platform designed to bridge software engineering, data science, and UI/UX design talent with UN Sustainable Development Goal initiatives around the world."
    },
    {
      q: "How does the Collaborator Match Percentage algorithm work?",
      a: "Our algorithm compares required project skills against user skills (weighted 60%) and evaluates primary SDG Goal alignment (weighted 40%), plus bonus weight for experience level and weekly availability."
    },
    {
      q: "Can students and junior developers join projects?",
      a: "Absolutely! Projects on SDG Connect list roles for all experience levels, from student volunteers working on open-source web modules to senior architects guiding microgrid telemetry systems."
    },
    {
      q: "Is SDG Connect free for NGOs and non-profits?",
      a: "Yes! Non-profits, university research labs, and green tech incubators can publish projects, recruit collaborators, and manage deliverables completely free of charge."
    },
    {
      q: "How are project impact metrics verified?",
      a: "Projects track measurable outcomes (e.g. liters of water monitored, tons of CO2 offset, students reached) directly within their dedicated Project Workspace dashboard."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Header */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>SDG Connect Mission & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Accelerating Sustainable Tech Collaboration
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We believe that open-source software, artificial intelligence, and skill-based collaboration are essential tools to solve the world's most pressing environmental and humanitarian challenges.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-xl font-bold text-white">The Tech Collaboration Gap</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Thousands of non-profits, academic research centers, and green initiatives lack the software engineering bandwidth required to build resilient digital infrastructure. Concurrently, millions of talented developers seek meaningful ways to contribute to global sustainability.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-xl font-bold text-white">The SDG Connect Platform</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            SDG Connect introduces intelligent skill-based matching, transparent SDG alignment, and open project workspaces. By connecting tech talent directly with vetted sustainability initiatives, we accelerate progress toward the UN 2030 Agenda.
          </p>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="glass-card rounded-3xl p-8 border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-white">Ready to Join the Sustainability Tech Movement?</h2>
        <div className="flex justify-center gap-3">
          <Link
            to="/collaborators"
            className="px-6 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
          >
            Find Collaborators
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-slate-800 text-white"
          >
            Explore Projects
          </Link>
        </div>
      </div>

    </div>
  );
}
