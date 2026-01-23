import { useState } from "react";
import { ChevronDown, Plus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { taskGroups } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles = {
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "to-do": "bg-gray-100 text-gray-800 border-gray-200",
  upcoming: "bg-orange-100 text-orange-800 border-orange-200",
};

const priorityStyles = {
  high: "bg-orange-500 text-white",
  low: "bg-green-500 text-white",
};

export function TasksWidget() {
  const [openGroups, setOpenGroups] = useState<string[]>(["1", "2", "3"]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {taskGroups.map((group) => (
          <Collapsible
            key={group.id}
            open={openGroups.includes(group.id)}
            onOpenChange={() => toggleGroup(group.id)}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer py-2">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    openGroups.includes(group.id) && "rotate-180"
                  )}
                />
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusStyles[group.status])}
                >
                  {group.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {group.tasks.length}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 ml-6 mt-2">
                {group.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox id={task.id} />
                    <label
                      htmlFor={task.id}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {task.title}
                    </label>
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        priorityStyles[task.priority]
                      )}
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {task.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground mt-4"
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </CardContent>
    </Card>
  );
}
