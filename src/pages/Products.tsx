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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Package,
  RefreshCw,
  Calendar,
  Search,
  Store,
  CheckCircle2,
  Archive,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProducts,
  syncProducts,
  setPage,
  setLimit,
  setShop,
  setStatus,
  setVendor,
  setProductType,
  setSearch,
  setDateRange,
  setInventoryRange,
  setHasOutOfStock,
  setSorting,
  resetFilters,
  clearError,
  clearSyncError,
} from "@/store/slices/productsSlice";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types/api";
import type { ViewMode } from "@/store/slices/viewModeSlice";

const getStatusBadgeStyles = (status: ProductStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    case "DRAFT":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
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

const Products = () => {
  const dispatch = useAppDispatch();
  const {
    records,
    pagination,
    loading,
    error,
    filters,
    syncing,
    syncError,
  } = useAppSelector((state) => state.products);
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
    dispatch(fetchProducts(filters));
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
        syncProducts({
          shop: syncShop.trim(),
          fullSync,
          autoDetectSyncType: true,
        })
      ).unwrap();

      if (result.success) {
        toast.success(result.message || "Products synced successfully");
        setSyncDialogOpen(false);
        setSyncShop("");
        setFullSync(false);
        // Refresh products list
        dispatch(fetchProducts(filters));
      }
    } catch (error) {
      const apiError = error as { error?: { message?: string } };
      toast.error(
        apiError?.error?.message || "Failed to sync products"
      );
    }
  };

  const handleRemoveShopFilter = () => {
    dispatch(setShop(undefined));
  };

  const handleRemoveStatusFilter = () => {
    dispatch(setStatus(undefined));
  };

  const handleRemoveVendorFilter = () => {
    dispatch(setVendor(undefined));
  };

  const handleRemoveProductTypeFilter = () => {
    dispatch(setProductType(undefined));
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

  const handleRemoveInventoryFilter = (type: "min" | "max") => {
    if (type === "min") {
      dispatch(setInventoryRange({ minInventory: undefined }));
    } else {
      dispatch(setInventoryRange({ maxInventory: undefined }));
    }
  };

  const handleRemoveHasOutOfStockFilter = () => {
    dispatch(setHasOutOfStock(undefined));
  };

  const handleView = (id: number) => {
    console.log("View product:", id);
  };

  const handleEdit = (id: number) => {
    console.log("Edit product:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete product:", id);
  };

  const hasActiveFilters =
    filters.shop ||
    filters.status ||
    filters.vendor ||
    filters.productType ||
    filters.search ||
    filters.start_date ||
    filters.end_date ||
    filters.minInventory !== undefined ||
    filters.maxInventory !== undefined ||
    filters.hasOutOfStock !== undefined;

  const activeFilterCount = [
    filters.shop,
    filters.status,
    filters.vendor,
    filters.productType,
    filters.search,
    filters.start_date,
    filters.end_date,
    filters.minInventory !== undefined,
    filters.maxInventory !== undefined,
    filters.hasOutOfStock !== undefined,
  ].filter(Boolean).length;

  // Calculate summary statistics from records
  const summaryStats = useMemo(() => {
    const activeCount = records.filter((p) => p.status === "ACTIVE").length;
    const archivedCount = records.filter((p) => p.status === "ARCHIVED").length;
    const draftCount = records.filter((p) => p.status === "DRAFT").length;
    const outOfStockCount = records.filter((p) => p.hasOutOfStockVariants).length;
    const uniqueStores = new Set(records.map((p) => p.shopDomain)).size;
    const totalInventory = records.reduce((sum, p) => sum + p.totalInventory, 0);

    return {
      total: pagination?.total || 0,
      active: activeCount,
      archived: archivedCount,
      draft: draftCount,
      outOfStock: outOfStockCount,
      uniqueStores,
      totalInventory,
    };
  }, [records, pagination]);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <Button
            onClick={() => setSyncDialogOpen(true)}
            className="gap-2"
            disabled={syncing}
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            <span className="hidden sm:inline">Sync Products</span>
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
                      Total Products
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summaryStats.total.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">All products</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Products
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-700 dark:text-green-300">
                      {summaryStats.active.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Published products</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                      {summaryStats.uniqueStores.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Unique shops</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Out of Stock
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
                      {summaryStats.outOfStock.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Products with no stock</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 dark:text-amber-400" />
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
                  All Products
                </CardTitle>
                {pagination && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {pagination.total} total {pagination.total === 1 ? "product" : "products"}
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
                  {filters.status && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveStatusFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveStatusFilter();
                        }
                      }}
                    >
                      <span className="capitalize">Status: {filters.status}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.vendor && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveVendorFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveVendorFilter();
                        }
                      }}
                    >
                      <span>Vendor: {filters.vendor}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.productType && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveProductTypeFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveProductTypeFilter();
                        }
                      }}
                    >
                      <span>Type: {filters.productType}</span>
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
                  {filters.minInventory !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveInventoryFilter("min")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveInventoryFilter("min");
                        }
                      }}
                    >
                      <span>Min Inventory: {filters.minInventory}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.maxInventory !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveInventoryFilter("max")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveInventoryFilter("max");
                        }
                      }}
                    >
                      <span>Max Inventory: {filters.maxInventory}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.hasOutOfStock !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveHasOutOfStockFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveHasOutOfStockFilter();
                        }
                      }}
                    >
                      <span>Out of Stock: {filters.hasOutOfStock ? "Yes" : "No"}</span>
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
                          placeholder="Search products..."
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
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status
                      </Label>
                      <Select
                        value={filters.status || "all"}
                        onValueChange={(value) =>
                          dispatch(setStatus(value === "all" ? undefined : (value as ProductStatus)))
                        }
                      >
                        <SelectTrigger id="status" className="h-10">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vendor" className="text-sm font-medium">
                        Vendor
                      </Label>
                      <Input
                        id="vendor"
                        type="text"
                        placeholder="Vendor name"
                        value={filters.vendor || ""}
                        onChange={(e) => dispatch(setVendor(e.target.value || undefined))}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productType" className="text-sm font-medium">
                        Product Type
                      </Label>
                      <Input
                        id="productType"
                        type="text"
                        placeholder="Product type"
                        value={filters.productType || ""}
                        onChange={(e) => dispatch(setProductType(e.target.value || undefined))}
                        className="h-10"
                      />
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
                          <SelectItem value="shopify_updated_at">Shopify Updated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minInventory" className="text-sm font-medium">
                        Min Inventory
                      </Label>
                      <Input
                        id="minInventory"
                        type="number"
                        placeholder="0"
                        value={filters.minInventory !== undefined ? filters.minInventory : ""}
                        onChange={(e) =>
                          dispatch(
                            setInventoryRange({
                              minInventory: e.target.value ? Number(e.target.value) : undefined,
                            })
                          )
                        }
                        className="h-10"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxInventory" className="text-sm font-medium">
                        Max Inventory
                      </Label>
                      <Input
                        id="maxInventory"
                        type="number"
                        placeholder="10000"
                        value={filters.maxInventory !== undefined ? filters.maxInventory : ""}
                        onChange={(e) =>
                          dispatch(
                            setInventoryRange({
                              maxInventory: e.target.value ? Number(e.target.value) : undefined,
                            })
                          )
                        }
                        className="h-10"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hasOutOfStock" className="text-sm font-medium">
                        Out of Stock
                      </Label>
                      <Select
                        value={
                          filters.hasOutOfStock === undefined
                            ? "all"
                            : filters.hasOutOfStock
                            ? "true"
                            : "false"
                        }
                        onValueChange={(value) =>
                          dispatch(
                            setHasOutOfStock(
                              value === "all" ? undefined : value === "true"
                            )
                          )
                        }
                      >
                        <SelectTrigger id="hasOutOfStock" className="h-10">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
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
                    {error.error?.message || "An error occurred while fetching products"}
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
                            onClick={() => handleColumnSort("title")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Title
                            {getSortIcon("title")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold">
                          Shop
                        </TableHead>
                        <TableHead className="h-12 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("status")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Status
                            {getSortIcon("status")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("vendor")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Vendor
                            {getSortIcon("vendor")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("product_type")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Type
                            {getSortIcon("product_type")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden sm:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("total_inventory")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Inventory
                            {getSortIcon("total_inventory")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">
                          Price Range
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("last_synced_at")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Last Synced
                            {getSortIcon("last_synced_at")}
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
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-24" />
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
                          <TableCell colSpan={9} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-3">
                              <Package className="h-12 w-12 text-muted-foreground opacity-50" />
                              <div>
                                <p className="text-sm font-medium">No products found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try adjusting your filters or sync products
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((product) => (
                          <TableRow
                            key={product.id}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{product.title}</span>
                                {product.handle && (
                                  <span className="text-xs text-muted-foreground">
                                    {product.handle}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <a
                                href={`https://${product.shopDomain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                {formatShopName(product.shopDomain)}
                              </a>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  getStatusBadgeStyles(product.status)
                                )}
                              >
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              <span className="text-sm text-muted-foreground">
                                {product.vendor || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              <span className="text-sm text-muted-foreground">
                                {product.productType || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-4">
                              <span className="text-sm font-medium">
                                {product.totalInventory}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              {product.priceRange ? (
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {product.priceRange.min.currencyCode}{" "}
                                    {product.priceRange.min.amount}
                                  </span>
                                  {product.priceRange.min.amount !==
                                    product.priceRange.max.amount && (
                                    <span className="text-xs text-muted-foreground">
                                      - {product.priceRange.max.currencyCode}{" "}
                                      {product.priceRange.max.amount}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              {product.lastSyncedAt ? (
                                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDate(product.lastSyncedAt)}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-muted"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => handleView(product.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(product.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
              <DialogTitle>Sync Products</DialogTitle>
              <DialogDescription>
                Sync products from a Shopify store. The system will automatically determine
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
                  Force full sync (sync all products regardless of last sync time)
                </Label>
              </div>
              {syncError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {syncError.error?.message || "Failed to sync products"}
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
                {syncing ? "Syncing..." : "Sync Products"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Products;

