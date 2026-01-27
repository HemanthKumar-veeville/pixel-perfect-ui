import { Sparkles, RefreshCw, FolderPlus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8">
      <p className="text-sm text-muted-foreground mb-1">{formattedDate}</p>
      <h1 className="text-3xl font-bold mb-6">
        Good morning,{" "}
        <span className="gradient-text">Karthik</span> 👋
      </h1>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2 rounded-full">
          <Sparkles className="h-4 w-4 text-primary" />
          Ask AI
        </Button>
        <Button variant="outline" className="gap-2 rounded-full">
          <RefreshCw className="h-4 w-4" />
          Get tasks updates
        </Button>
        <Button variant="outline" className="gap-2 rounded-full">
          <FolderPlus className="h-4 w-4" />
          Create workspace
        </Button>
        <Button variant="outline" className="gap-2 rounded-full">
          <Link2 className="h-4 w-4" />
          Connect apps
        </Button>
      </div>
    </div>
  );
}
