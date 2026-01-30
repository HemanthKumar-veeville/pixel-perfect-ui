import { useEffect, useState, useMemo, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Eye,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  RefreshCw,
  Calendar,
  Search,
  Store,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrders,
  syncOrders,
  setPage,
  setLimit,
  setShop,
  setFinancialStatus,
  setFulfillmentStatus,
  setOrderStatus,
  setCancelled,
  setClosed,
  setConfirmed,
  setTest,
  setCustomerId,
  setSearch,
  setDateRange,
  setTotalRange,
  setSorting,
  resetFilters,
  clearError,
  clearSyncError,
} from "@/store/slices/ordersSlice";
import { cn } from "@/lib/utils";
import type { OrderFinancialStatus, OrderFulfillmentStatus, OrderStatus } from "@/types/api";
import type { ViewMode } from "@/store/slices/viewModeSlice";

const getFinancialStatusBadgeStyles = (status: OrderFinancialStatus) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "refunded":
    case "partially_refunded":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "partially_paid":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "voided":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const getFulfillmentStatusBadgeStyles = (status: OrderFulfillmentStatus) => {
  switch (status) {
    case "fulfilled":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "unfulfilled":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "partial":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "restocked":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatShopName = (shopDomain: string) => {
  if (!shopDomain) return "-";
  return shopDomain.replace(/\.myshopify\.com$/i, "");
};

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const {
    records,
    pagination,
    loading,
    error,
    filters,
    syncing,
    syncError,
  } = useAppSelector((state) => state.orders);
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncShop, setSyncShop] = useState("");
  const [fullSync, setFullSync] = useState(false);
  const previousViewModeRef = useRef<ViewMode>(viewMode);

  // Auto-apply store filter when in Store View
  // Reset all filters when switching to Admin View
  useEffect(() => {
    if (viewMode === "store" && selectedStore) {
      if (filters.shop !== selectedStore) {
        dispatch(setShop(selectedStore));
      }
    } else if (viewMode === "admin" && previousViewModeRef.current === "store") {
      // Clear all filters when switching FROM Store View TO Admin View
      dispatch(resetFilters());
    }
    previousViewModeRef.current = viewMode;
  }, [viewMode, selectedStore, filters.shop, dispatch]);

  useEffect(() => {
    dispatch(fetchOrders(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleColumnSort = (field: string) => {
    const currentField = filters.orderBy || "created_at";
    const currentDirection = filters.orderDirection || "DESC";

    if (currentField === field) {
      const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
      dispatch(setSorting({ orderBy: field, orderDirection: newDirection }));
    } else {
      dispatch(setSorting({ orderBy: field, orderDirection: "DESC" }));
    }
  };

  const getSortIcon = (field: string) => {
    const currentField = filters.orderBy || "created_at";
    const currentDirection = filters.orderDirection || "DESC";

    if (currentField !== field) {
      return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />;
    }

    return currentDirection === "ASC" ? (
      <ArrowUp className="ml-2 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-2 h-3.5 w-3.5" />
    );
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleSync = async () => {
    if (!syncShop.trim()) {
      toast.error("Please enter a shop domain");
      return;
    }

    try {
      const result = await dispatch(
        syncOrders({
          shop: syncShop.trim(),
          fullSync,
          autoDetectSyncType: true,
        })
      ).unwrap();

      if (result.success) {
        toast.success(result.message || "Orders synced successfully");
        setSyncDialogOpen(false);
        setSyncShop("");
        setFullSync(false);
        // Refresh orders list
        dispatch(fetchOrders(filters));
      }
    } catch (error) {
      const apiError = error as { error?: { message?: string } };
      toast.error(
        apiError?.error?.message || "Failed to sync orders"
      );
    }
  };

  const handleRemoveShopFilter = () => {
    dispatch(setShop(undefined));
  };

  const handleRemoveFinancialStatusFilter = () => {
    dispatch(setFinancialStatus(undefined));
  };

  const handleRemoveFulfillmentStatusFilter = () => {
    dispatch(setFulfillmentStatus(undefined));
  };

  const handleRemoveOrderStatusFilter = () => {
    dispatch(setOrderStatus(undefined));
  };

  const handleRemoveCancelledFilter = () => {
    dispatch(setCancelled(undefined));
  };

  const handleRemoveClosedFilter = () => {
    dispatch(setClosed(undefined));
  };

  const handleRemoveConfirmedFilter = () => {
    dispatch(setConfirmed(undefined));
  };

  const handleRemoveTestFilter = () => {
    dispatch(setTest(undefined));
  };

  const handleRemoveCustomerIdFilter = () => {
    dispatch(setCustomerId(undefined));
  };

  const handleRemoveSearchFilter = () => {
    dispatch(setSearch(undefined));
  };

  const handleRemoveDateFilter = (type: "start_date" | "end_date") => {
    if (type === "start_date") {
      dispatch(setDateRange({ start_date: undefined }));
    } else {
      dispatch(setDateRange({ end_date: undefined }));
    }
  };

  const handleRemoveTotalFilter = (type: "min" | "max") => {
    if (type === "min") {
      dispatch(setTotalRange({ minTotal: undefined }));
    } else {
      dispatch(setTotalRange({ maxTotal: undefined }));
    }
  };

  const handleView = (id: number) => {
    console.log("View order:", id);
  };

  const hasActiveFilters =
    filters.shop ||
    filters.financialStatus ||
    filters.fulfillmentStatus ||
    filters.orderStatus ||
    filters.cancelled !== undefined ||
    filters.closed !== undefined ||
    filters.confirmed !== undefined ||
    filters.test !== undefined ||
    filters.customerId ||
    filters.search ||
    filters.start_date ||
    filters.end_date ||
    filters.minTotal !== undefined ||
    filters.maxTotal !== undefined;

  const activeFilterCount = [
    filters.shop,
    filters.financialStatus,
    filters.fulfillmentStatus,
    filters.orderStatus,
    filters.cancelled !== undefined,
    filters.closed !== undefined,
    filters.confirmed !== undefined,
    filters.test !== undefined,
    filters.customerId,
    filters.search,
    filters.start_date,
    filters.end_date,
    filters.minTotal !== undefined,
    filters.maxTotal !== undefined,
  ].filter(Boolean).length;

  // Calculate summary statistics from records
  const summaryStats = useMemo(() => {
    const paidCount = records.filter((o) => o.financialStatus === "paid").length;
    const pendingCount = records.filter((o) => o.financialStatus === "pending").length;
    const fulfilledCount = records.filter((o) => o.fulfillmentStatus === "fulfilled").length;
    const unfulfilledCount = records.filter((o) => o.fulfillmentStatus === "unfulfilled").length;
    const uniqueStores = new Set(records.map((o) => o.shopDomain)).size;
    const totalRevenue = records.reduce((sum, o) => sum + o.totals.total.amount, 0);
    const currencyCode = records[0]?.totals.total.currencyCode || "USD";

    return {
      total: pagination?.total || 0,
      paid: paidCount,
      pending: pendingCount,
      fulfilled: fulfilledCount,
      unfulfilled: unfulfilledCount,
      uniqueStores,
      totalRevenue,
      currencyCode,
    };
  }, [records, pagination]);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
          <Button
            onClick={() => setSyncDialogOpen(true)}
            className="gap-2"
            disabled={syncing}
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            <span className="hidden sm:inline">Sync Orders</span>
            <span className="sm:hidden">Sync</span>
          </Button>
        </div>

        {/* Summary Cards */}
        {pagination && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Orders
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summaryStats.total.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">All orders</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Paid Orders
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-700 dark:text-green-300">
                      {summaryStats.paid.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Completed payments</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Orders
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-yellow-700 dark:text-yellow-300">
                      {summaryStats.pending.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting payment</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                      {formatCurrency(summaryStats.totalRevenue, summaryStats.currencyCode)}
                    </div>
                    <p className="text-xs text-muted-foreground">From all orders</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                    <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Table Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  All Orders
                </CardTitle>
                {pagination && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {pagination.total} total {pagination.total === 1 ? "order" : "orders"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="gap-2 h-9"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Reset Filters</span>
                    <span className="sm:hidden">Reset</span>
                  </Button>
                )}
                <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                      {activeFilterCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-semibold bg-primary text-primary-foreground"
                        >
                          {activeFilterCount}
                        </Badge>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          filtersOpen && "rotate-180"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Applied Filters Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground mr-1">
                    Active filters:
                  </span>
                  {filters.shop && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveShopFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveShopFilter();
                        }
                      }}
                    >
                      <span>Shop: {formatShopName(filters.shop)}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.financialStatus && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveFinancialStatusFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveFinancialStatusFilter();
                        }
                      }}
                    >
                      <span className="capitalize">Financial: {filters.financialStatus.replace(/_/g, " ")}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.fulfillmentStatus && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveFulfillmentStatusFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveFulfillmentStatusFilter();
                        }
                      }}
                    >
                      <span className="capitalize">Fulfillment: {filters.fulfillmentStatus}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.orderStatus && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveOrderStatusFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveOrderStatusFilter();
                        }
                      }}
                    >
                      <span className="capitalize">Status: {filters.orderStatus}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveSearchFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveSearchFilter();
                        }
                      }}
                    >
                      <span>Search: {filters.search}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.start_date && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveDateFilter("start_date")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveDateFilter("start_date");
                        }
                      }}
                    >
                      <span>From: {new Date(filters.start_date).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.end_date && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveDateFilter("end_date")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveDateFilter("end_date");
                        }
                      }}
                    >
                      <span>To: {new Date(filters.end_date).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.minTotal !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveTotalFilter("min")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveTotalFilter("min");
                        }
                      }}
                    >
                      <span>Min Total: {filters.minTotal}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.maxTotal !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveTotalFilter("max")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveTotalFilter("max");
                        }
                      }}
                    >
                      <span>Max Total: {filters.maxTotal}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              )}

              {/* Filters Section */}
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleContent className="space-y-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6 border-b">
                    <div className="space-y-2">
                      <Label htmlFor="search" className="text-sm font-medium">
                        Search
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="search"
                          type="text"
                          placeholder="Search orders..."
                          value={filters.search || ""}
                          onChange={(e) => dispatch(setSearch(e.target.value || undefined))}
                          className="pl-9 h-10"
                        />
                      </div>
                    </div>

                    {viewMode === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="shop" className="text-sm font-medium">
                          Shop Domain
                        </Label>
                        <Input
                          id="shop"
                          type="text"
                          placeholder="store.myshopify.com"
                          value={filters.shop || ""}
                          onChange={(e) => dispatch(setShop(e.target.value || undefined))}
                          className="h-10"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="financialStatus" className="text-sm font-medium">
                        Financial Status
                      </Label>
                      <Select
                        value={filters.financialStatus || "all"}
                        onValueChange={(value) =>
                          dispatch(setFinancialStatus(value === "all" ? undefined : (value as OrderFinancialStatus)))
                        }
                      >
                        <SelectTrigger id="financialStatus" className="h-10">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                          <SelectItem value="partially_paid">Partially Paid</SelectItem>
                          <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                          <SelectItem value="voided">Voided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fulfillmentStatus" className="text-sm font-medium">
                        Fulfillment Status
                      </Label>
                      <Select
                        value={filters.fulfillmentStatus || "all"}
                        onValueChange={(value) =>
                          dispatch(setFulfillmentStatus(value === "all" ? undefined : (value as OrderFulfillmentStatus)))
                        }
                      >
                        <SelectTrigger id="fulfillmentStatus" className="h-10">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="restocked">Restocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderStatus" className="text-sm font-medium">
                        Order Status
                      </Label>
                      <Select
                        value={filters.orderStatus || "all"}
                        onValueChange={(value) =>
                          dispatch(setOrderStatus(value === "all" ? undefined : (value as OrderStatus)))
                        }
                      >
                        <SelectTrigger id="orderStatus" className="h-10">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={filters.start_date || ""}
                        onChange={(e) =>
                          dispatch(
                            setDateRange({
                              start_date: e.target.value || undefined,
                              dateField: filters.dateField || "created_at",
                            })
                          )
                        }
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={filters.end_date || ""}
                        onChange={(e) =>
                          dispatch(
                            setDateRange({
                              end_date: e.target.value || undefined,
                              dateField: filters.dateField || "created_at",
                            })
                          )
                        }
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateField" className="text-sm font-medium">
                        Date Field
                      </Label>
                      <Select
                        value={filters.dateField || "created_at"}
                        onValueChange={(value) =>
                          dispatch(
                            setDateRange({
                              dateField: value,
                              start_date: filters.start_date,
                              end_date: filters.end_date,
                            })
                          )
                        }
                      >
                        <SelectTrigger id="dateField" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created_at">Created At</SelectItem>
                          <SelectItem value="updated_at">Updated At</SelectItem>
                          <SelectItem value="last_synced_at">Last Synced</SelectItem>
                          <SelectItem value="shopify_created_at">Shopify Created</SelectItem>
                          <SelectItem value="shopify_updated_at">Shopify Updated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minTotal" className="text-sm font-medium">
                        Min Total
                      </Label>
                      <Input
                        id="minTotal"
                        type="number"
                        placeholder="0"
                        value={filters.minTotal !== undefined ? filters.minTotal : ""}
                        onChange={(e) =>
                          dispatch(
                            setTotalRange({
                              minTotal: e.target.value ? Number(e.target.value) : undefined,
                            })
                          )
                        }
                        className="h-10"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTotal" className="text-sm font-medium">
                        Max Total
                      </Label>
                      <Input
                        id="maxTotal"
                        type="number"
                        placeholder="10000"
                        value={filters.maxTotal !== undefined ? filters.maxTotal : ""}
                        onChange={(e) =>
                          dispatch(
                            setTotalRange({
                              maxTotal: e.target.value ? Number(e.target.value) : undefined,
                            })
                          )
                        }
                        className="h-10"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="limit" className="text-sm font-medium">
                        Items Per Page
                      </Label>
                      <Select
                        value={String(filters.limit || 50)}
                        onValueChange={(value) => handleLimitChange(Number(value))}
                      >
                        <SelectTrigger id="limit" className="h-10">
                          <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error.error?.message || "An error occurred while fetching orders"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Table Section */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b hover:bg-transparent">
                        <TableHead className="h-12 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("order_name")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Order Name
                            {getSortIcon("order_name")}
                          </button>
                        </TableHead>
                        {viewMode === "admin" && (
                          <TableHead className="h-12 font-semibold">
                            Shop
                          </TableHead>
                        )}
                        <TableHead className="h-12 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("financial_status")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Financial Status
                            {getSortIcon("financial_status")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("fulfillment_status")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Fulfillment Status
                            {getSortIcon("fulfillment_status")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          Total
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">
                          Items
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("shopify_created_at")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Created At
                            {getSortIcon("shopify_created_at")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index} className="hover:bg-transparent">
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            {viewMode === "admin" && (
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                            )}
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={viewMode === "admin" ? 8 : 7} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-3">
                              <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-50" />
                              <div>
                                <p className="text-sm font-medium">No orders found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try adjusting your filters or sync orders
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((order) => (
                          <TableRow
                            key={order.id}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{order.orderName}</span>
                                <span className="text-xs text-muted-foreground">
                                  #{order.orderNumber}
                                </span>
                              </div>
                            </TableCell>
                            {viewMode === "admin" && (
                              <TableCell className="py-4">
                                <a
                                  href={`https://${order.shopDomain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-primary hover:underline"
                                >
                                  {formatShopName(order.shopDomain)}
                                </a>
                              </TableCell>
                            )}
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  getFinancialStatusBadgeStyles(order.financialStatus)
                                )}
                              >
                                {order.financialStatus.replace(/_/g, " ").toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  getFulfillmentStatusBadgeStyles(order.fulfillmentStatus)
                                )}
                              >
                                {order.fulfillmentStatus.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              <span className="text-sm font-medium">
                                {formatCurrency(order.totals.total.amount, order.totals.total.currencyCode)}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              <span className="text-sm text-muted-foreground">
                                {order.lineItems.reduce((sum, item) => sum + item.quantity, 0)} items
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              {order.shopifyCreatedAt ? (
                                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDate(order.shopifyCreatedAt)}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() => handleView(order.id)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View order</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
                    {pagination.total === 1 ? "result" : "results"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1 || loading}
                      className="gap-2 h-9"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>
                    <div className="flex items-center gap-1 px-4 py-2 rounded-md bg-muted text-sm font-medium min-w-[100px] justify-center">
                      <span className="text-muted-foreground">Page</span>{" "}
                      <span className="font-semibold">{pagination.page}</span>
                      <span className="text-muted-foreground">of</span>{" "}
                      <span className="font-semibold">{pagination.totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasMore || loading}
                      className="gap-2 h-9"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sync Dialog */}
        <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sync Orders</DialogTitle>
              <DialogDescription>
                Sync orders from a Shopify store. The system will automatically determine
                whether to perform a full or incremental sync.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="syncShop">Shop Domain</Label>
                <Input
                  id="syncShop"
                  type="text"
                  placeholder="store.myshopify.com"
                  value={syncShop}
                  onChange={(e) => setSyncShop(e.target.value)}
                  disabled={syncing}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the shop domain (e.g., store.myshopify.com)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="fullSync"
                  checked={fullSync}
                  onChange={(e) => setFullSync(e.target.checked)}
                  disabled={syncing}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="fullSync" className="text-sm font-normal cursor-pointer">
                  Force full sync (sync all orders regardless of last sync time)
                </Label>
              </div>
              {syncError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {syncError.error?.message || "Failed to sync orders"}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSyncDialogOpen(false);
                  setSyncShop("");
                  setFullSync(false);
                  dispatch(clearSyncError());
                }}
                disabled={syncing}
              >
                Cancel
              </Button>
              <Button onClick={handleSync} disabled={syncing || !syncShop.trim()}>
                <RefreshCw className={cn("mr-2 h-4 w-4", syncing && "animate-spin")} />
                {syncing ? "Syncing..." : "Sync Orders"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Orders;

