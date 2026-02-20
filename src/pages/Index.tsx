import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* KPI Cards */}
        <DashboardStats />
        
        {/* Statistics Chart */}
        <StatisticsChart />
      </div>
    </DashboardLayout>
  );
};

export default Index;
