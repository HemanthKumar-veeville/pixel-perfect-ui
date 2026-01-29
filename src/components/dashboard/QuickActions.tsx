import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Store,
  Users,
  Package,
  Coins,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "outline";
}

const QuickAction = ({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
}: QuickActionProps) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "w-full justify-start gap-3 h-auto p-4",
        variant === "outline" && "border-dashed"
      )}
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-sm">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </Button>
  );
};

export const QuickActions = () => {
  const navigate = useNavigate();
  const { viewMode } = useAppSelector((state) => state.viewMode);

  const actions: QuickActionProps[] = [
    {
      icon: Wand2,
      label: "View Generations",
      description: "See all image and video generations",
      onClick: () => navigate("/generations"),
    },
    {
      icon: Package,
      label: "Manage Products",
      description: "View and sync products",
      onClick: () => navigate("/products"),
    },
    {
      icon: Users,
      label: "View Customers",
      description: "Manage customer data",
      onClick: () => navigate("/customers"),
    },
  ];

  if (viewMode === "admin") {
    actions.push(
      {
        icon: Store,
        label: "Manage Stores",
        description: "View all registered stores",
        onClick: () => navigate("/stores"),
      },
      {
        icon: Coins,
        label: "View Credits",
        description: "Manage store credits",
        onClick: () => navigate("/credits"),
      }
    );
  } else {
    actions.push({
      icon: Store,
      label: "Store Settings",
      description: "Manage your store",
      onClick: () => navigate("/store"),
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </CardContent>
    </Card>
  );
};

