import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Briefcase,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "AI Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Learning",
    path: "/learning",
    icon: BookOpen,
  },
  {
    name: "Career",
    path: "/career",
    icon: Briefcase,
  },
  {
    name: "Community",
    path: "/community",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 256,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="min-h-screen overflow-hidden border-r border-zinc-800 bg-zinc-950"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 p-5">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-blue-500">
              NEXORA
            </h1>

            <p className="text-xs text-zinc-500">
              AI Operating System
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 transition hover:bg-zinc-800"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      collapsed ? "justify-center" : "gap-3"
                    } rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />

                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;