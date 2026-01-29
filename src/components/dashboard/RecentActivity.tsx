import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchImageGenerations } from "@/store/slices/imageGenerationsSlice";
import { fetchStores } from "@/store/slices/storesSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sparkles,
  Store,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const getStatusIcon = (status: string, type: "generation" | "store" | "product") => {
  const statusLower = status.toLowerCase();
  
  // Handle generation statuses
  if (type === "generation") {
    switch (statusLower) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  }
  
  // Handle product statuses
  if (type === "product") {
    switch (statusLower) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "archived":
        return <XCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  }
  
  // Handle store statuses
  if (type === "store") {
    return statusLower === "active" ? (
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    );
  }
  
  return <Clock className="h-4 w-4 text-muted-foreground" />;
};

const getStatusBadge = (status: string, type: "generation" | "store" | "product") => {
  const statusLower = status.toLowerCase();
  const variants: Record<string, string> = {
    completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    failed: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    processing: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    active: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    inactive: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
    archived: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium capitalize", variants[statusLower] || "bg-gray-100 text-gray-800")}
    >
      {status}
    </Badge>
  );
};

const getActivityTypeLabel = (type: "generation" | "store" | "product") => {
  switch (type) {
    case "generation":
      return "Generation";
    case "store":
      return "Store";
    case "product":
      return "Product";
    default:
      return "Activity";
  }
};

interface RecentActivityItemProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  time: string;
  status?: string;
  type?: "generation" | "store" | "product";
  onClick?: () => void;
  loading?: boolean;
}

const RecentActivityItem = ({
  icon: Icon,
  title,
  subtitle,
  time,
  status,
  type = "generation",
  onClick,
  loading,
}: RecentActivityItemProps) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 justify-center">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-16 rounded-full" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      className={cn("hover:bg-muted/50 cursor-pointer", onClick && "cursor-pointer")}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">{time}</span>
      </TableCell>
      <TableCell>
        {status && (
          <div className="flex items-center gap-2 justify-center">
            {getStatusIcon(status, type)}
            <span className="text-xs font-medium capitalize">{status.toLowerCase()}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {getActivityTypeLabel(type)}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export const RecentActivity = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  const {
    records: imageGenerations,
    loading: imageLoading,
  } = useAppSelector((state) => state.imageGenerations);

  const {
    records: stores,
    loading: storesLoading,
  } = useAppSelector((state) => state.stores);

  const {
    records: products,
    loading: productsLoading,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Fetch recent image generations
    const imageFilters: any = { page: 1, limit: 5, orderBy: "created_at", orderDirection: "DESC" };
    if (viewMode === "store" && selectedStore) {
      imageFilters.storeName = selectedStore.replace(/\.myshopify\.com$/i, "");
    }
    dispatch(fetchImageGenerations(imageFilters));

    // Fetch recent stores (only in admin view)
    if (viewMode === "admin") {
      dispatch(fetchStores({ limit: 5, offset: 0 }));
    }

    // Fetch recent products
    const productFilters: any = { page: 1, limit: 5, orderBy: "created_at", orderDirection: "DESC" };
    if (viewMode === "store" && selectedStore) {
      productFilters.shop = selectedStore;
    }
    dispatch(fetchProducts(productFilters));
  }, [dispatch, viewMode, selectedStore]);

  const isLoading = imageLoading || storesLoading || productsLoading;

  // Combine and sort activities
  const activities: Array<{
    type: "generation" | "store" | "product";
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    createdAt: string;
    status?: string;
    onClick: () => void;
  }> = [];

  // Add generations
  imageGenerations.slice(0, 3).forEach((gen) => {
    activities.push({
      type: "generation",
      icon: Sparkles,
      title: `Image generation for ${gen.storeName}`,
      subtitle: gen.customerEmail || gen.email,
      createdAt: gen.createdAt,
      status: gen.status,
      onClick: () => navigate("/generations"),
    });
  });

  // Add stores (admin only)
  if (viewMode === "admin") {
    stores.slice(0, 2).forEach((store) => {
      const shopDomain = store.shop || "";
      activities.push({
        type: "store",
        icon: Store,
        title: shopDomain.replace(/\.myshopify\.com$/i, "") || "Unknown Store",
        subtitle: store.isActive ? "Active" : "Inactive",
        createdAt: store.createdAt,
        status: store.isActive ? "active" : "inactive",
        onClick: () => navigate("/stores"),
      });
    });
  }

  // Add products
  products.slice(0, 2).forEach((product) => {
    activities.push({
      type: "product",
      icon: Package,
      title: product.title,
      subtitle: product.shopDomain?.replace(/\.myshopify\.com$/i, ""),
      createdAt: product.createdAt,
      status: product.status,
      onClick: () => navigate("/products"),
    });
  });

  // Sort by time (most recent first)
  activities.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  const recentActivities = activities.slice(0, 5).map((activity) => ({
    ...activity,
    time: formatDate(activity.createdAt),
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/generations")}
          className="gap-2"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Activity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[60px] text-center">Status</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <RecentActivityItem
                  key={index}
                  icon={Sparkles}
                  title=""
                  time=""
                  loading={true}
                />
              ))}
            </TableBody>
          </Table>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Activity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[60px] text-center">Status</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <RecentActivityItem
                  key={`${activity.type}-${index}`}
                  icon={activity.icon}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  time={activity.time}
                  status={activity.status}
                  type={activity.type}
                  onClick={activity.onClick}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

