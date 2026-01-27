import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ComingSoon } from "@/components/ui/coming-soon";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="md:hidden p-4">
            <ComingSoon />
          </div>
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
