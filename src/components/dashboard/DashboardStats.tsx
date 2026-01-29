import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStores } from "@/store/slices/storesSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { fetchCustomers } from "@/store/slices/customersSlice";
import { fetchImageGenerations } from "@/store/slices/imageGenerationsSlice";
import { fetchVideoGenerations } from "@/store/slices/videoGenerationsSlice";
import { fetchStoresCredits } from "@/store/slices/storesCreditsSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store,
  Package,
  Users,
  Sparkles,
  Video,
  Coins,
  TrendingUp,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
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
            {description && (
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
              iconColor.includes("indigo") && "bg-indigo-500/20"
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
                iconColor.includes("indigo") && "text-indigo-600 dark:text-indigo-400"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardStats = () => {
  const dispatch = useAppDispatch();
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);
  const { user } = useAppSelector((state) => state.auth);

  // Store data
  const {
    records: stores,
    pagination: storesPagination,
    loading: storesLoading,
  } = useAppSelector((state) => state.stores);

  // Products data
  const {
    records: products,
    pagination: productsPagination,
    loading: productsLoading,
  } = useAppSelector((state) => state.products);

  // Customers data
  const {
    records: customers,
    pagination: customersPagination,
    summary: customersSummary,
    loading: customersLoading,
  } = useAppSelector((state) => state.customers);

  // Image Generations data
  const {
    records: imageGenerations,
    pagination: imagePagination,
    summary: imageSummary,
    loading: imageLoading,
  } = useAppSelector((state) => state.imageGenerations);

  // Video Generations data
  const {
    records: videoGenerations,
    pagination: videoPagination,
    loading: videoLoading,
  } = useAppSelector((state) => state.videoGenerations);

  // Stores Credits data
  const {
    summary: creditsSummary,
    loading: creditsLoading,
  } = useAppSelector((state) => state.storesCredits);

  // Fetch data on mount
  useEffect(() => {
    // Fetch stores (only in admin view)
    if (viewMode === "admin") {
      dispatch(fetchStores({ limit: 1, offset: 0 }));
    }

    // Fetch products (fetch more to calculate active products)
    const productFilters: any = { page: 1, limit: 100 };
    if (viewMode === "store" && selectedStore) {
      productFilters.shop = selectedStore;
    }
    dispatch(fetchProducts(productFilters));

    // Fetch customers
    const customerFilters: any = { page: 1, limit: 1 };
    if (viewMode === "store" && selectedStore) {
      customerFilters.store = selectedStore;
    }
    dispatch(fetchCustomers(customerFilters));

    // Fetch image generations
    const imageFilters: any = { page: 1, limit: 1 };
    if (viewMode === "store" && selectedStore) {
      imageFilters.storeName = selectedStore.replace(/\.myshopify\.com$/i, "");
    }
    dispatch(fetchImageGenerations(imageFilters));

    // Fetch video generations (handle 404 gracefully if endpoint doesn't exist)
    // This endpoint may not be available, so we catch errors silently
    const videoFilters: any = { page: 1, limit: 1 };
    dispatch(fetchVideoGenerations(videoFilters)).catch(() => {
      // Silently ignore errors for video generations - endpoint may not exist
      // The component will handle missing data gracefully
    });

    // Fetch stores credits (only in admin view)
    if (viewMode === "admin") {
      dispatch(fetchStoresCredits({ page: 1, limit: 1 }));
    }
  }, [dispatch, viewMode, selectedStore]);

  // Calculate statistics
  const totalStores = storesPagination?.total || 0;
  const totalProducts = productsPagination?.total || 0;
  const totalCustomers = customersSummary?.totalCustomers || customersPagination?.total || 0;
  const totalImageGenerations = imageSummary?.generationsCount || imagePagination?.total || 0;
  const totalVideoGenerations = videoPagination?.total || 0;
  const totalGenerations = totalImageGenerations + totalVideoGenerations;
  const activeStores = stores.filter((s) => s.isActive).length;
  const totalCreditBalance = creditsSummary?.totalCreditBalance || 0;
  const completedGenerations = imageSummary?.statusBreakdown?.completed || 0;
  const activeProducts = products.filter((p) => p.status === "ACTIVE").length;

  const isLoading =
    storesLoading ||
    productsLoading ||
    customersLoading ||
    imageLoading ||
    videoLoading ||
    creditsLoading;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {viewMode === "admin" && (
        <>
          <StatCard
            title="Total Stores"
            value={totalStores}
            description="All registered stores"
            icon={Store}
            iconColor="text-primary"
            borderColor="border-l-primary"
            loading={isLoading}
          />
          <StatCard
            title="Active Stores"
            value={activeStores}
            description="Currently active"
            icon={TrendingUp}
            iconColor="text-green-600 dark:text-green-400"
            borderColor="border-l-green-500"
            bgGradient="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30"
            loading={isLoading}
          />
        </>
      )}

      <StatCard
        title="Total Products"
        value={totalProducts}
        description="All products"
        icon={Package}
        iconColor="text-blue-600 dark:text-blue-400"
        borderColor="border-l-blue-500"
        bgGradient="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30"
        loading={isLoading}
      />

      <StatCard
        title="Total Customers"
        value={totalCustomers}
        description={customersSummary ? `${customersSummary.storesCount} stores` : "All customers"}
        icon={Users}
        iconColor="text-purple-600 dark:text-purple-400"
        borderColor="border-l-purple-500"
        bgGradient="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30"
        loading={isLoading}
      />

      <StatCard
        title="Total Generations"
        value={totalGenerations}
        description={`${totalImageGenerations} images, ${totalVideoGenerations} videos`}
        icon={Sparkles}
        iconColor="text-orange-600 dark:text-orange-400"
        borderColor="border-l-orange-500"
        bgGradient="bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/30"
        loading={isLoading}
      />

      {viewMode === "admin" ? (
        <>
          <StatCard
            title="Completed Generations"
            value={completedGenerations}
            description={`${totalGenerations > 0 ? Math.round((completedGenerations / totalGenerations) * 100) : 0}% success rate`}
            icon={CheckCircle2}
            iconColor="text-green-600 dark:text-green-400"
            borderColor="border-l-green-500"
            bgGradient="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30"
            loading={isLoading}
          />

          <StatCard
            title="Active Products"
            value={activeProducts}
            description={`${totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}% of total`}
            icon={ShoppingBag}
            iconColor="text-indigo-600 dark:text-indigo-400"
            borderColor="border-l-indigo-500"
            bgGradient="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/30"
            loading={isLoading}
          />
        </>
      ) : (
        <StatCard
          title="Active Products"
          value={activeProducts}
          description={`${totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}% of total`}
          icon={ShoppingBag}
          iconColor="text-indigo-600 dark:text-indigo-400"
          borderColor="border-l-indigo-500"
          bgGradient="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/30"
          loading={isLoading}
        />
      )}

      {viewMode === "admin" && creditsSummary && (
        <StatCard
          title="Total Credits"
          value={totalCreditBalance.toLocaleString()}
          description="Across all stores"
          icon={Coins}
          iconColor="text-primary"
          borderColor="border-l-primary"
          loading={isLoading}
        />
      )}
    </div>
  );
};

