import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="md:hidden p-4">
          <SidebarTrigger />
        </div>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
