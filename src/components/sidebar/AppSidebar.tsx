import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Wand2,
  Store,
  Coins,
  UserCircle,
  Package,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

const adminNavigationItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Generations", icon: Wand2, url: "/generations" },
  { title: "Stores", icon: Store, url: "/stores" },
  { title: "Customers", icon: UserCircle, url: "/customers" },
  { title: "Credits", icon: Coins, url: "/credits" },
  { title: "Products", icon: Package, url: "/products" },
];

const storeNavigationItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Generations", icon: Wand2, url: "/generations" },
  { title: "Store", icon: Store, url: "/store" },
  { title: "Customers", icon: UserCircle, url: "/customers" },
  { title: "Products", icon: Package, url: "/products" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  // Determine which navigation items to show
  const navigationItems =
    viewMode === "store" ? storeNavigationItems : adminNavigationItems;

  // Redirect if user is on Stores or Credits page when switching to Store View
  useEffect(() => {
    if (viewMode === "store") {
      if (location.pathname === "/stores" || location.pathname === "/credits") {
        navigate("/store", { replace: true });
      }
    } else {
      if (location.pathname === "/store") {
        navigate("/stores", { replace: true });
      }
    }
  }, [viewMode, location.pathname, navigate]);

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <img 
            src="/NUSENSE_LOGO.svg" 
            alt="Nusense Logo" 
            className="w-[10rem] h-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="w-full justify-start gap-3 px-3 py-2.5"
                    >
                      <NavLink to={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
