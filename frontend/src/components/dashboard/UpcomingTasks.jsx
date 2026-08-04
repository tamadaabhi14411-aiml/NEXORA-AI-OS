import DashboardSection from "./DashboardSection";

const tasks = [
  {
    id: 1,
    title: "Complete React Dashboard",
    priority: "High",
    due: "Today",
  },
  {
    id: 2,
    title: "Finish Tailwind Components",
    priority: "Medium",
    due: "Tomorrow",
  },
  {
    id: 3,
    title: "Review UI Responsiveness",
    priority: "Low",
    due: "This Week",
  },
];

function UpcomingTasks() {
  return (
    <DashboardSection title="Upcoming Tasks">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/50 p-4 transition hover:border-blue-500/40"
          >
            <div>
              <h3 className="font-semibold text-white">
                {task.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Due: {task.due}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                task.priority === "High"
                  ? "bg-red-500/20 text-red-400"
                  : task.priority === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}

export default UpcomingTasks;