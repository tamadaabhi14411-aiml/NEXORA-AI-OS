import DashboardLayout from "../../layouts/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import QuickActions from "../../components/dashboard/QuickActions";
import AISuggestions from "../../components/dashboard/AISuggestions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import UpcomingTasks from "../../components/dashboard/UpcomingTasks";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeCard />

        {/* Statistics */}
        <StatsGrid />

        {/* Quick Actions */}
        <QuickActions />

        {/* AI Suggestions & Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-2">
          <AISuggestions />
          <RecentActivity />
        </div>

        {/* Upcoming Tasks */}
        <UpcomingTasks />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;