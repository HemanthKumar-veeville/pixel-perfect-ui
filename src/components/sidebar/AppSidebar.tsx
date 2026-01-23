import { useState } from "react";
import {
  Home,
  Sparkles,
  CheckSquare,
  Inbox,
  Calendar,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  UserPlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { sidebarProjects } from "@/data/mockData";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Prodify AI", icon: Sparkles, url: "/ai" },
  { title: "My tasks", icon: CheckSquare, url: "/tasks" },
  { title: "Inbox", icon: Inbox, url: "/inbox", badge: 3 },
  { title: "Calendar", icon: Calendar, url: "/calendar" },
  { title: "Reports & Analytics", icon: BarChart3, url: "/reports" },
];

export function AppSidebar() {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Sarah Johnson</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setActiveItem(item.title)}
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      activeItem === item.title
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-lg px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  My Projects
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    projectsOpen && "rotate-180"
                  )}
                />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  {sidebarProjects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                        <span
                          className={cn("h-2 w-2 rounded-full", project.color)}
                        />
                        <span className="text-sm">{project.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Add project</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-sm font-medium mb-2">Invite your team</p>
          <p className="text-xs text-muted-foreground mb-3">
            Collaborate with your team members
          </p>
          <Button size="sm" className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            Invite people
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
