import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sampleDashboardStats } from "@/data/dashboardSampleData";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  borderColor?: string;
  bgGradient?: string;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  description,
  change,
  changeLabel = "last 30 days",
  icon: Icon,
  iconColor = "text-primary",
  borderColor = "border-l-primary",
  bgGradient,
  loading,
}: StatCardProps) => {
  if (loading) {
    return (
      <Card className={cn("shadow-sm hover:shadow-md transition-all duration-200 border-l-4", borderColor)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              {description && <Skeleton className="h-3 w-20" />}
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "shadow-sm hover:shadow-md transition-all duration-200 border-l-4",
        borderColor,
        bgGradient
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs font-medium",
                  change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {change >= 0 ? "+" : ""}{typeof change === "number" ? change.toLocaleString() : change}
                </span>
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              </div>
            )}
            {description && !change && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0",
              iconColor.includes("primary") && "bg-primary/10",
              iconColor.includes("blue") && "bg-blue-500/20",
              iconColor.includes("green") && "bg-green-500/20",
              iconColor.includes("purple") && "bg-purple-500/20",
              iconColor.includes("orange") && "bg-orange-500/20",
              iconColor.includes("red") && "bg-red-500/20",
              iconColor.includes("yellow") && "bg-yellow-500/20"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6 sm:h-7 sm:w-7",
                iconColor.includes("primary") && "text-primary",
                iconColor.includes("blue") && "text-blue-600 dark:text-blue-400",
                iconColor.includes("green") && "text-green-600 dark:text-green-400",
                iconColor.includes("purple") && "text-purple-600 dark:text-purple-400",
                iconColor.includes("orange") && "text-orange-600 dark:text-orange-400",
                iconColor.includes("red") && "text-red-600 dark:text-red-400",
                iconColor.includes("yellow") && "text-yellow-600 dark:text-yellow-400"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardStats = () => {
  // Using sample data temporarily instead of API calls
  const stats = sampleDashboardStats;
  const isLoading = false;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Main Metrics - Available Pages */}
      <StatCard
        title="Total Stores"
        value={stats.totalStores}
        change={stats.changes.stores}
        icon={Store}
        iconColor="text-primary"
        borderColor="border-l-primary"
        loading={isLoading}
      />
      <StatCard
        title="Total Customers"
        value={stats.totalCustomers}
        change={stats.changes.customers}
        icon={Users}
        iconColor="text-purple-600 dark:text-purple-400"
        borderColor="border-l-purple-500"
        bgGradient="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30"
        loading={isLoading}
      />
      <StatCard
        title="Total Generations"
        value={stats.totalGenerations}
        change={stats.changes.generations}
        icon={Sparkles}
        iconColor="text-orange-600 dark:text-orange-400"
        borderColor="border-l-orange-500"
        bgGradient="bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/30"
        loading={isLoading}
      />
      <StatCard
        title="Completed Generations"
        value={stats.completedGenerations}
        description={`${stats.totalGenerations > 0 ? Math.round((stats.completedGenerations / stats.totalGenerations) * 100) : 0}% success rate`}
        icon={TrendingUp}
        iconColor="text-green-600 dark:text-green-400"
        borderColor="border-l-green-500"
        bgGradient="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30"
        loading={isLoading}
      />
    </div>
  );
};

