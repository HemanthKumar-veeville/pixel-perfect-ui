import { useNavigate } from "react-router-dom";
import { ViewModeSwitcher } from "@/components/view-mode/ViewModeSwitcher";
import { StoreSelector } from "@/components/view-mode/StoreSelector";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function DashboardHeader() {
  const navigate = useNavigate();
  const { viewMode } = useAppSelector((state) => state.viewMode);
  const { user, logout, loading } = useAuth();

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const handleProfileClick = () => {
    console.log("Profile clicked");
    // TODO: Navigate to profile page when implemented
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    // TODO: Navigate to settings page when implemented
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear auth and redirect
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-sidebar/95">
      <div className="flex h-16 items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
          {/* View Mode Switcher */}
          <div className="flex-shrink-0">
            <ViewModeSwitcher />
          </div>

          {/* Store Selector - Only show in Store View */}
          {viewMode === "store" && (
            <>
              <Separator 
                orientation="vertical" 
                className="h-6 hidden sm:block bg-sidebar-border" 
              />
              <div className="min-w-[200px] max-w-[320px] w-full sm:w-auto flex-shrink-0">
                <StoreSelector />
              </div>
            </>
          )}
        </div>

        {/* User Information - Right End */}
        <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end pr-1">
            <span className="font-medium text-sm text-sidebar-foreground leading-snug">
              {userName}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground leading-snug">Online</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground transition-all hover:bg-sidebar-accent/80 hover:scale-105 focus:outline-none focus:ring-0 active:scale-95"
                aria-label="User menu"
              >
                <Avatar className="h-full w-full border-0">
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  {userEmail && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogoutClick} 
                disabled={loading}
                className="cursor-pointer text-destructive focus:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{loading ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

