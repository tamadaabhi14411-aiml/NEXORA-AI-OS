import {
    Bot,
    BookOpen,
    Briefcase,
    Users,
  } from "lucide-react";
  
  import Card from "../ui/Card";
  
  const actions = [
    {
      title: "AI Chat",
      description: "Start a new AI conversation",
      icon: Bot,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Learning",
      description: "Continue your courses",
      icon: BookOpen,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Career",
      description: "View job opportunities",
      icon: Briefcase,
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
      title: "Community",
      description: "Connect with developers",
      icon: Users,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];
  
  function QuickActions() {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-white">
          Quick Actions
        </h2>
  
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
  
            return (
              <button
                key={action.title}
                className={`${action.color} rounded-2xl p-5 text-left transition duration-300`}
              >
                <Icon size={30} className="mb-4 text-white" />
  
                <h3 className="text-lg font-semibold text-white">
                  {action.title}
                </h3>
  
                <p className="mt-2 text-sm text-white/80">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </Card>
    );
  }
  
  export default QuickActions;