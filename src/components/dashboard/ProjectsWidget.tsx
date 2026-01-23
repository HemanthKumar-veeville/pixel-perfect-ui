import { Plus, MoreHorizontal, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function ProjectsWidget() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Projects</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center text-lg",
                project.color
              )}
            >
              {project.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{project.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{project.teammates} teammates</span>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full gap-2 mt-4 border-dashed"
        >
          <Plus className="h-4 w-4" />
          Create new project
        </Button>
      </CardContent>
    </Card>
  );
}
