import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-3 text-zinc-400">
          Welcome to NEXORA AI OS.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;