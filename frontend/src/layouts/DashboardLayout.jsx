import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex flex-1 flex-col">
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 bg-zinc-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;