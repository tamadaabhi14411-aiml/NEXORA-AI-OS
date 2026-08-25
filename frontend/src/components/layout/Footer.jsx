import { Link } from "react-router-dom";
import { Globe, Heart, ShieldCheck, Share2, Code, ExternalLink } from "lucide-react";
import { SDG_LIST } from "../../data/sdgData";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SDG Goals Ribbon */}
        <div className="mb-10 pb-8 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Supporting All 17 UN Sustainable Development Goals
            </h4>
            <Link to="/sdgs" className="text-xs text-emerald-400 hover:underline">
              View SDG Directory →
            </Link>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-17 gap-1.5">
            {SDG_LIST.map((sdg) => (
              <Link
                key={sdg.id}
                to={`/sdgs`}
                title={`SDG ${sdg.number}: ${sdg.title}`}
                className="h-8 rounded flex items-center justify-center font-bold text-white text-xs transition-transform hover:scale-110 shadow-sm"
                style={{ backgroundColor: sdg.color }}
              >
                {sdg.number}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg">SDG Connect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging technological expertise with sustainable development initiatives globally. Open-source tech collaboration platform.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 text-xs flex items-center gap-1">
                <Code className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 text-xs flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Col 2: Platform Routes */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/projects" className="hover:text-emerald-400">Explore Projects</Link></li>
              <li><Link to="/collaborators" className="hover:text-emerald-400">Find Collaborators</Link></li>
              <li><Link to="/workspace/proj_1" className="hover:text-emerald-400">Project Workspace</Link></li>
              <li><Link to="/create-project" className="hover:text-emerald-400">Post a Project</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400">Impact Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Ecosystem</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/sdgs" className="hover:text-emerald-400">17 SDG Goals</Link></li>
              <li><Link to="/organizations" className="hover:text-emerald-400">Organizations & NGOs</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400">How It Works</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400">Workshop Demo Accounts</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter / College Workshop Notice */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">College Workshop MVP</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed as a high-impact college showcase application featuring local state persistence and real-time collaborator matching algorithms.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>100% Client-side local sandbox mode active.</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SDG Connect Initiative. Open Source Sustainable Tech Platform.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Global Sustainability</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
