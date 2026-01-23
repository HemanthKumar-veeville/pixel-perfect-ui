import { ChevronLeft, ChevronRight, Video, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { weekDays, calendarEvents } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function CalendarWidget() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week view */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {weekDays.map((day) => (
            <div
              key={day.day}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer",
                day.isToday
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-xs font-medium">{day.day}</span>
              <span className={cn("text-lg font-semibold", day.isToday && "text-primary-foreground")}>
                {day.date}
              </span>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-3">
          {calendarEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{event.title}</h4>
                <span className="text-sm text-muted-foreground">{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {event.attendees.map((attendee, index) => (
                    <Avatar key={index} className="h-7 w-7 border-2 border-card">
                      <AvatarFallback className="text-xs bg-primary/20">
                        {attendee.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-card">
                    +2
                  </div>
                </div>
                {event.meetLink && (
                  <Button size="sm" variant="outline" className="gap-2 text-xs">
                    <Video className="h-3 w-3" />
                    Google Meet
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
