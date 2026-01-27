import { useEffect, useState, useRef } from "react";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Plus,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Users,
  Package,
  CheckCircle2,
  Sparkles,
  Calendar,
  Search,
  Maximize2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchImageGenerations,
  setPage,
  setLimit,
  setStatus,
  setStoreName,
  setUser,
  setDateRange,
  setCustomerEmail,
  setCustomerName,
  setSorting,
  resetFilters,
  clearError,
} from "@/store/slices/imageGenerationsSlice";
import type { ViewMode } from "@/store/slices/viewModeSlice";
import { cn } from "@/lib/utils";
import type { GenerationStatus, OrderBy, OrderDirection } from "@/types/api";

const getStatusBadgeStyles = (status: GenerationStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatStoreName = (storeName: string) => {
  if (!storeName) return "-";
  return storeName.replace(/\.myshopify\.com$/i, "");
};

const Generations = () => {
  const dispatch = useAppDispatch();
  const {
    records,
    pagination,
    summary,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.imageGenerations);
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const previousViewModeRef = useRef<ViewMode>(viewMode);

  // Auto-apply and enforce store filter when in Store View
  // Reset all filters when switching to Admin View
  useEffect(() => {
    if (viewMode === "store" && selectedStore) {
      // Extract store name from shop domain (remove .myshopify.com)
      const storeName = selectedStore.replace(/\.myshopify\.com$/i, "");
      // Always enforce the store filter in Store View mode
      if (filters.storeName !== storeName) {
        dispatch(setStoreName(storeName));
      }
    } else if (viewMode === "admin" && previousViewModeRef.current === "store") {
      // Clear all filters when switching FROM Store View TO Admin View
      dispatch(resetFilters());
    }
    previousViewModeRef.current = viewMode;
  }, [viewMode, selectedStore, filters.storeName, dispatch]);

  // Re-apply store filter if it gets removed while in Store View
  useEffect(() => {
    if (viewMode === "store" && selectedStore && !filters.storeName) {
      const storeName = selectedStore.replace(/\.myshopify\.com$/i, "");
      dispatch(setStoreName(storeName));
    }
  }, [viewMode, selectedStore, filters.storeName, dispatch]);

  useEffect(() => {
    dispatch(fetchImageGenerations(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleStatusChange = (status: string) => {
    dispatch(setStatus(status === "all" ? undefined : (status as GenerationStatus)));
  };

  const handleStoreNameChange = (storeName: string) => {
    // Prevent changing store filter in Store View mode
    if (viewMode === "store" && selectedStore) {
      return;
    }
    dispatch(setStoreName(storeName || undefined));
  };

  const handleDateRangeChange = (field: "start_date" | "end_date", value: string) => {
    dispatch(
      setDateRange({
        [field]: value || undefined,
      })
    );
  };

  const handleColumnSort = (field: OrderBy) => {
    const currentField = filters.orderBy || "created_at";
    const currentDirection = filters.orderDirection || "DESC";

    if (currentField === field) {
      const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
      dispatch(setSorting({ orderBy: field, orderDirection: newDirection }));
    } else {
      dispatch(setSorting({ orderBy: field, orderDirection: "DESC" }));
    }
  };

  const getSortIcon = (field: OrderBy) => {
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
    // In Store View, preserve the store filter
    if (viewMode === "store" && selectedStore) {
      const storeName = selectedStore.replace(/\.myshopify\.com$/i, "");
      // Reset all filters except storeName
      dispatch(setStatus(undefined));
      dispatch(setDateRange({ start_date: undefined, end_date: undefined }));
      dispatch(setCustomerEmail(undefined));
      dispatch(setCustomerName(undefined));
      dispatch(setPage(1));
      dispatch(setLimit(50));
      dispatch(setSorting({ orderBy: "created_at", orderDirection: "DESC" }));
      // Ensure store filter is maintained
      if (filters.storeName !== storeName) {
        dispatch(setStoreName(storeName));
      }
    } else {
      dispatch(resetFilters());
    }
  };

  const handleFilterByStatus = (status: GenerationStatus) => {
    dispatch(setStatus(status));
  };

  const handleFilterByStoreName = (storeName: string) => {
    // Prevent changing store filter in Store View mode
    if (viewMode === "store" && selectedStore) {
      return;
    }
    dispatch(setStoreName(storeName));
  };

  const handleRemoveStatusFilter = () => {
    dispatch(setStatus(undefined));
  };

  const handleRemoveStoreNameFilter = () => {
    // Prevent removing store filter in Store View mode
    if (viewMode === "store" && selectedStore) {
      return;
    }
    dispatch(setStoreName(undefined));
  };

  const handleRemoveDateFilter = (type: "start_date" | "end_date") => {
    if (type === "start_date") {
      dispatch(setDateRange({ start_date: undefined }));
    } else {
      dispatch(setDateRange({ end_date: undefined }));
    }
  };

  const handleCustomerEmailChange = (email: string) => {
    dispatch(setCustomerEmail(email || undefined));
  };

  const handleCustomerNameChange = (name: string) => {
    dispatch(setCustomerName(name || undefined));
  };

  const handleRemoveCustomerEmailFilter = () => {
    dispatch(setCustomerEmail(undefined));
  };

  const handleRemoveCustomerNameFilter = () => {
    dispatch(setCustomerName(undefined));
  };

  const handleView = (id: string) => {
    console.log("View generation:", id);
  };

  const handleDownload = (id: string) => {
    console.log("Download generation:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete generation:", id);
  };

  const hasActiveFilters =
    filters.status ||
    filters.storeName ||
    filters.start_date ||
    filters.end_date ||
    filters.customerEmail ||
    filters.customerName;

  const activeFilterCount = [
    filters.status,
    filters.storeName,
    filters.start_date,
    filters.end_date,
    filters.customerEmail,
    filters.customerName,
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Generations</h1>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Generations
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.generationsCount}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Customers
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.customersCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Active users</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Products
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.productsCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Linked products</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
                      {summary.statusBreakdown.completed}
                    </div>
                    <p className="text-xs text-muted-foreground">Successful</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-500" />
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
                  All Generations
                </CardTitle>
                {pagination && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {pagination.total} total {pagination.total === 1 ? "generation" : "generations"}
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
                  {filters.status && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={handleRemoveStatusFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveStatusFilter();
                        }
                      }}
                      aria-label={`Remove status filter: ${filters.status}`}
                    >
                      <span className="capitalize">Status: {filters.status}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.storeName && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "gap-1.5 px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        viewMode === "store" && selectedStore
                          ? "cursor-not-allowed opacity-75"
                          : "cursor-pointer hover:bg-secondary/80"
                      )}
                      onClick={handleRemoveStoreNameFilter}
                      role={viewMode === "store" && selectedStore ? "button" : "button"}
                      tabIndex={viewMode === "store" && selectedStore ? -1 : 0}
                      onKeyDown={(e) => {
                        if (viewMode === "store" && selectedStore) {
                          return;
                        }
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveStoreNameFilter();
                        }
                      }}
                      aria-label={
                        viewMode === "store" && selectedStore
                          ? `Store filter: ${formatStoreName(filters.storeName)} (locked in Store View)`
                          : `Remove store filter: ${formatStoreName(filters.storeName)}`
                      }
                    >
                      <span>Store: {formatStoreName(filters.storeName)}</span>
                      {!(viewMode === "store" && selectedStore) && (
                        <X className="h-3 w-3" />
                      )}
                    </Badge>
                  )}
                  {filters.start_date && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => handleRemoveDateFilter("start_date")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveDateFilter("start_date");
                        }
                      }}
                      aria-label={`Remove start date filter: ${new Date(filters.start_date).toLocaleDateString()}`}
                    >
                      <span>From: {new Date(filters.start_date).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.end_date && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => handleRemoveDateFilter("end_date")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveDateFilter("end_date");
                        }
                      }}
                      aria-label={`Remove end date filter: ${new Date(filters.end_date).toLocaleDateString()}`}
                    >
                      <span>To: {new Date(filters.end_date).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.customerEmail && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={handleRemoveCustomerEmailFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveCustomerEmailFilter();
                        }
                      }}
                      aria-label={`Remove customer email filter: ${filters.customerEmail}`}
                    >
                      <span>Email: {filters.customerEmail}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.customerName && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={handleRemoveCustomerNameFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveCustomerNameFilter();
                        }
                      }}
                      aria-label={`Remove customer name filter: ${filters.customerName}`}
                    >
                      <span>Customer: {filters.customerName}</span>
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
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status
                      </Label>
                      <Select
                        value={filters.status || "all"}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger id="status" className="h-10">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeName" className="text-sm font-medium">
                        Store Name
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="storeName"
                          placeholder="Filter by store name"
                          value={filters.storeName || ""}
                          onChange={(e) => handleStoreNameChange(e.target.value)}
                          className="pl-9 h-10"
                          disabled={viewMode === "store" && selectedStore !== null}
                          aria-label={viewMode === "store" && selectedStore ? "Store filter is locked in Store View mode" : "Filter by store name"}
                        />
                      </div>
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
                        onChange={(e) => handleDateRangeChange("start_date", e.target.value)}
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
                        onChange={(e) => handleDateRangeChange("end_date", e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="text-sm font-medium">
                        Customer Email
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="Filter by customer email"
                          value={filters.customerEmail || ""}
                          onChange={(e) => handleCustomerEmailChange(e.target.value)}
                          className="pl-9 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="text-sm font-medium">
                        Customer Name
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="customerName"
                          type="text"
                          placeholder="Filter by customer name"
                          value={filters.customerName || ""}
                          onChange={(e) => handleCustomerNameChange(e.target.value)}
                          className="pl-9 h-10"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error.error?.message || "An error occurred while fetching generations"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Table Section */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b hover:bg-transparent">
                        <TableHead className="h-12 font-semibold">Store Name</TableHead>
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
                        <TableHead className="h-12 font-semibold hidden md:table-cell">Person</TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">Clothing</TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">Generated</TableHead>
                        <TableHead className="h-12 font-semibold hidden sm:table-cell">Customer</TableHead>
                        <TableHead className="h-12 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("created_at")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Created
                            {getSortIcon("created_at")}
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
                            <TableCell>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-20 w-16 rounded" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-20 w-16 rounded" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-20 w-16 rounded" />
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24 sm:w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={8} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-3">
                              <Sparkles className="h-12 w-12 text-muted-foreground opacity-50" />
                              <div>
                                <p className="text-sm font-medium">No generations found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try adjusting your filters
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((generation) => (
                          <TableRow
                            key={generation.id}
                            className="border-b hover:bg-transparent"
                          >
                            <TableCell className="py-4">
                              <button
                                type="button"
                                onClick={() => handleFilterByStoreName(generation.storeName)}
                                className="text-sm sm:text-base font-medium text-left hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 underline-offset-4 hover:underline"
                                aria-label={`Filter by store: ${formatStoreName(generation.storeName)}`}
                              >
                                {formatStoreName(generation.storeName)}
                              </button>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium cursor-pointer hover:scale-105 hover:shadow-sm transition-all duration-200",
                                  getStatusBadgeStyles(generation.status)
                                )}
                                onClick={() => handleFilterByStatus(generation.status)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleFilterByStatus(generation.status);
                                  }
                                }}
                                aria-label={`Filter by status: ${generation.status}`}
                              >
                                {generation.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              {generation.personImageUrl ? (
                                <div 
                                  className="relative w-20 h-auto flex items-center justify-center rounded-lg border bg-muted/30 p-1.5 group cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage({
                                      url: generation.personImageUrl,
                                      title: "Person Image",
                                    })
                                  }
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setSelectedImage({
                                        url: generation.personImageUrl,
                                        title: "Person Image",
                                      });
                                    }
                                  }}
                                  aria-label="View person image in full size"
                                >
                                  <img
                                    src={generation.personImageUrl}
                                    alt="Person"
                                    className="w-full h-auto object-contain max-h-24 pointer-events-none"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center pointer-events-none">
                                    <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              {generation.clothingImageUrl ? (
                                <div 
                                  className="relative w-20 h-auto flex items-center justify-center rounded-lg border bg-muted/30 p-1.5 group cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage({
                                      url: generation.clothingImageUrl,
                                      title: "Clothing Image",
                                    })
                                  }
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setSelectedImage({
                                        url: generation.clothingImageUrl,
                                        title: "Clothing Image",
                                      });
                                    }
                                  }}
                                  aria-label="View clothing image in full size"
                                >
                                  <img
                                    src={generation.clothingImageUrl}
                                    alt="Clothing"
                                    className="w-full h-auto object-contain max-h-24 pointer-events-none"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center pointer-events-none">
                                    <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              {generation.generatedImageUrl ? (
                                <div 
                                  className="relative w-20 h-auto flex items-center justify-center rounded-lg border bg-muted/30 p-1.5 group cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage({
                                      url: generation.generatedImageUrl,
                                      title: "Generated Image",
                                    })
                                  }
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setSelectedImage({
                                        url: generation.generatedImageUrl,
                                        title: "Generated Image",
                                      });
                                    }
                                  }}
                                  aria-label="View generated image in full size"
                                >
                                  <img
                                    src={generation.generatedImageUrl}
                                    alt="Generated"
                                    className="w-full h-auto object-contain max-h-24 pointer-events-none"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center pointer-events-none">
                                    <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-4">
                              {generation.customerEmail ? (
                                <div className="flex flex-col space-y-0.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const fullName = `${generation.customerFirstName || ""} ${generation.customerLastName || ""}`.trim();
                                      if (fullName) {
                                        handleCustomerNameChange(fullName);
                                      }
                                    }}
                                    className="text-sm font-medium text-left hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 underline-offset-4 hover:underline"
                                    aria-label={`Filter by customer: ${generation.customerFirstName} ${generation.customerLastName}`}
                                  >
                                    {generation.customerFirstName} {generation.customerLastName}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleCustomerEmailChange(generation.customerEmail);
                                    }}
                                    className="text-xs text-muted-foreground text-left hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 underline-offset-4 hover:underline"
                                    aria-label={`Filter by email: ${generation.customerEmail}`}
                                  >
                                    {generation.customerEmail}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                {formatDate(generation.createdAt)}
                              </span>
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
                                  <DropdownMenuItem onClick={() => handleView(generation.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  {generation.generatedImageUrl && (
                                    <DropdownMenuItem onClick={() => handleDownload(generation.id)}>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(generation.id)}
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
              {pagination && (
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
                      disabled={!pagination.hasPrev || loading}
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
                      disabled={!pagination.hasNext || loading}
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
      </div>

      {/* Image Viewer Dialog */}
      <Dialog 
        open={!!selectedImage} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 gap-0 bg-background border border-border shadow-2xl overflow-hidden sm:rounded-xl">
          {selectedImage && (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 min-h-[400px]">
              {/* Header with title */}
              <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">
                    {selectedImage.title}
                  </h3>
                </div>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => setSelectedImage(null)}
                    aria-label="Close image viewer"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>

              {/* Image container */}
              <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-8 pt-16 sm:pt-20 overflow-auto">
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[calc(95vh-120px)] w-auto h-auto object-contain rounded-lg shadow-lg border border-border/50"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>

              {/* Footer with image info */}
              <div className="absolute bottom-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 bg-background/80 backdrop-blur-md border-t border-border">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium">Click outside or press ESC to close</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Generations;
