import {
    Bot,
    BookOpen,
    Briefcase,
    Users,
  } from "lucide-react";
  
  import Card from "../ui/Card";
  
  const stats = [
    {
      title: "AI Assistant",
      description: "Continue your latest AI conversations.",
      icon: Bot,
      color: "text-blue-500",
    },
    {
      title: "Learning",
      description: "Resume your enrolled courses.",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: "Career",
      description: "Track jobs and opportunities.",
      icon: Briefcase,
      color: "text-yellow-500",
    },
    {
      title: "Community",
      description: "Connect with developers worldwide.",
      icon: Users,
      color: "text-purple-500",
    },
  ];
  
  function StatsGrid() {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
  
          return (
            <Card key={item.title}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {item.title}
                  </h2>
  
                  <p className="mt-2 text-sm text-zinc-400">
                    {item.description}
                  </p>
                </div>
  
                <div className="rounded-xl bg-zinc-800 p-3">
                  <Icon
                    size={28}
                    className={item.color}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }
  
  export default StatsGrid;