import DashboardSection from "./DashboardSection";

const suggestions = [
  {
    id: 1,
    title: "Continue React Learning",
    description:
      "You have completed 65% of the Advanced React course.",
  },
  {
    id: 2,
    title: "Improve Your Resume",
    description:
      "Our AI detected improvements that could increase your profile strength.",
  },
  {
    id: 3,
    title: "Practice Interview Questions",
    description:
      "Complete today's AI interview session to improve your confidence.",
  },
];

function AISuggestions() {
  return (
    <DashboardSection title="AI Suggestions">
      <div className="space-y-4">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-4 transition hover:border-blue-500/40"
          >
            <h3 className="text-lg font-semibold text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}

export default AISuggestions;