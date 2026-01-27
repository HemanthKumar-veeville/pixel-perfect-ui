import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact";
}

const ComingSoon = React.forwardRef<HTMLDivElement, ComingSoonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm transition-all duration-200",
          "hover:shadow-md",
          variant === "compact" && "px-2 py-1.5",
          className
        )}
        role="status"
        aria-label="Coming soon feature"
        {...props}
      >
        <Sparkles
          className={cn(
            "h-4 w-4 text-[hsl(262,83%,58%)] animate-pulse",
            variant === "compact" && "h-3.5 w-3.5"
          )}
          aria-hidden="true"
        />
        <Badge
          variant="outline"
          className={cn(
            "border-[hsl(262,83%,58%)]/30 bg-[hsl(262,83%,58%)]/10 text-[hsl(262,83%,58%)] font-medium",
            variant === "compact" && "text-xs px-1.5 py-0"
          )}
        >
          Coming Soon
        </Badge>
      </div>
    );
  }
);

ComingSoon.displayName = "ComingSoon";

export { ComingSoon };

