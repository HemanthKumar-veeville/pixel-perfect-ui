import { LayoutDashboard, Store } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setViewMode } from "@/store/slices/viewModeSlice";

export const ViewModeSwitcher = () => {
  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector((state) => state.viewMode);

  const handleViewModeChange = (value: string) => {
    if (value === "admin" || value === "store") {
      dispatch(setViewMode(value));
    }
  };

  return (
    <Tabs value={viewMode} onValueChange={handleViewModeChange} className="w-auto">
      <TabsList className="h-9 bg-sidebar-accent/30 border border-sidebar-border px-1 py-1 gap-1">
        <TabsTrigger 
          value="admin" 
          className="gap-2 px-3 sm:px-4 py-1 text-sm font-medium transition-all data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Admin</span>
        </TabsTrigger>
        <TabsTrigger 
          value="store" 
          className="gap-2 px-3 sm:px-4 py-1 text-sm font-medium transition-all data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Store className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Store</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
