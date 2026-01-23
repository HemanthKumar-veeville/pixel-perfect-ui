import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { ProjectsWidget } from "@/components/dashboard/ProjectsWidget";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { GoalsWidget } from "@/components/dashboard/GoalsWidget";
import { RemindersWidget } from "@/components/dashboard/RemindersWidget";

const Index = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Left column - Tasks */}
        <div className="xl:col-span-1">
          <TasksWidget />
        </div>

        {/* Middle column - Projects & Calendar */}
        <div className="space-y-6 xl:col-span-1">
          <ProjectsWidget />
          <CalendarWidget />
        </div>

        {/* Right column - Goals & Reminders */}
        <div className="space-y-6 xl:col-span-1">
          <GoalsWidget />
          <RemindersWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
