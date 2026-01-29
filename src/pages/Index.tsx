import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Statistics Cards */}
        <DashboardStats />
      </div>
    </DashboardLayout>
  );
};

export default Index;
