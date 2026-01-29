import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Sparkles, MessageSquare, Clock } from "lucide-react";

const Tickets = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-2xl mx-auto text-center space-y-8 px-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Ticket className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Tickets Coming Soon
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              We're building a powerful ticket management system to help you track, prioritize, and resolve support requests efficiently.
            </p>
          </div>

          {/* Features Preview */}
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">Support Tickets</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Manage customer inquiries and support requests in one place
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">Smart Routing</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automatically assign tickets to the right team members
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">Real-time Updates</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Track ticket status and get notified of important updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Stay tuned! We'll notify you as soon as tickets are available.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tickets;

