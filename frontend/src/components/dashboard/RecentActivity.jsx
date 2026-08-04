import Card from "../ui/Card";

const activities = [
  {
    id: 1,
    title: "🤖 AI Chat",
    description: "Continue your previous AI conversation.",
  },
  {
    id: 2,
    title: "📚 Learning",
    description: "React Advanced course is 65% completed.",
  },
  {
    id: 3,
    title: "💼 Career",
    description: "Two new job recommendations are available.",
  },
];

function RecentActivity() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-white">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-4 transition hover:border-blue-500/40"
          >
            <h3 className="font-medium text-white">
              {activity.title}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              {activity.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentActivity;