import { useState } from "react";
import { ChevronDown, Plus, MoreHorizontal, Bell, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { reminders } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function RemindersWidget() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Reminders</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer py-2 mb-2">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
              <span className="text-sm font-medium">Today</span>
              <span className="text-xs text-muted-foreground">
                ({reminders.length})
              </span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 ml-6">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="flex-1 text-sm">{reminder.title}</span>
                  {reminder.time && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{reminder.time}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground mt-4"
        >
          <Plus className="h-4 w-4" />
          Add reminder
        </Button>
      </CardContent>
    </Card>
  );
}
