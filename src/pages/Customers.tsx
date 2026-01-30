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
  Users,
  Sparkles,
  Calendar,
  Search,
  Maximize2,
  Mail,
  Store,
  UserCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import {
  fetchCustomers,
  setPage,
  setLimit,
  setStore,
  setCustomerEmail,
  setCustomerName,
  setStatus,
  setDateRange,
  setGenerationsRange,
  setSorting,
  resetFilters,
  clearError,
} from "@/store/slices/customersSlice";
import { cn } from "@/lib/utils";
import type { GenerationStatus } from "@/types/api";
import type { ViewMode } from "@/store/slices/viewModeSlice";

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

const formatShopName = (store: string | null | undefined) => {
  if (!store) return "N/A";
  return store.replace(/\.myshopify\.com$/i, "");
};

const Customers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    records,
    pagination,
    summary,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.customers);
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const previousViewModeRef = useRef<ViewMode>(viewMode);

  // Auto-apply store filter when in Store View
  // Reset all filters when switching to Admin View
  useEffect(() => {
    if (viewMode === "store" && selectedStore) {
      if (filters.store !== selectedStore) {
        dispatch(setStore(selectedStore));
      }
    } else if (viewMode === "admin" && previousViewModeRef.current === "store") {
      // Clear all filters when switching FROM Store View TO Admin View
      dispatch(resetFilters());
    }
    previousViewModeRef.current = viewMode;
  }, [viewMode, selectedStore, filters.store, dispatch]);

  useEffect(() => {
    dispatch(fetchCustomers(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleStoreChange = (store: string) => {
    dispatch(setStore(store || undefined));
  };

  const handleCustomerEmailChange = (email: string) => {
    dispatch(setCustomerEmail(email || undefined));
  };

  const handleCustomerNameChange = (name: string) => {
    dispatch(setCustomerName(name || undefined));
  };

  const handleStatusChange = (status: string) => {
    dispatch(setStatus(status === "all" ? undefined : (status as GenerationStatus)));
  };

  const handleDateRangeChange = (field: "startDate" | "endDate", value: string) => {
    dispatch(
      setDateRange({
        [field]: value || undefined,
      })
    );
  };

  const handleMinGenerationsChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    dispatch(setGenerationsRange({ minGenerations: numValue }));
  };

  const handleMaxGenerationsChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    dispatch(setGenerationsRange({ maxGenerations: numValue }));
  };

  const handleColumnSort = (field: "email" | "name" | "lastActivity" | "totalGenerations" | "store") => {
    const currentField = filters.orderBy || "lastActivity";
    const currentDirection = filters.orderDirection || "DESC";

    if (currentField === field) {
      const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
      dispatch(setSorting({ orderBy: field, orderDirection: newDirection }));
    } else {
      dispatch(setSorting({ orderBy: field, orderDirection: "DESC" }));
    }
  };

  const getSortIcon = (field: "email" | "name" | "lastActivity" | "totalGenerations" | "store") => {
    const currentField = filters.orderBy || "lastActivity";

    if (currentField !== field) {
      return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />;
    }

    return filters.orderDirection === "ASC" ? (
      <ArrowUp className="ml-2 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-2 h-3.5 w-3.5" />
    );
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleRemoveStoreFilter = () => {
    dispatch(setStore(undefined));
  };

  const handleRemoveEmailFilter = () => {
    dispatch(setCustomerEmail(undefined));
  };

  const handleRemoveNameFilter = () => {
    dispatch(setCustomerName(undefined));
  };

  const handleRemoveStatusFilter = () => {
    dispatch(setStatus(undefined));
  };

  const handleRemoveDateFilter = (type: "startDate" | "endDate") => {
    if (type === "startDate") {
      dispatch(setDateRange({ startDate: undefined }));
    } else {
      dispatch(setDateRange({ endDate: undefined }));
    }
  };

  const handleRemoveGenerationsFilter = (type: "min" | "max") => {
    if (type === "min") {
      dispatch(setGenerationsRange({ minGenerations: undefined }));
    } else {
      dispatch(setGenerationsRange({ maxGenerations: undefined }));
    }
  };

  const handleView = (customerId: string | null, customerEmail: string | null, storeName: string) => {
    if (!customerId || !storeName) {
      toast.error("Customer ID and store name are required");
      return;
    }

    // Find the customer record to pass full data
    const customer = records.find(
      (c) => c.customerId === customerId && c.storeName === storeName
    );

    if (customer) {
      navigate(
        `/customers/${encodeURIComponent(customerId)}/${encodeURIComponent(customerEmail || "")}/${encodeURIComponent(storeName)}`,
        {
          state: { customer },
        }
      );
    } else {
      toast.error("Customer data not found");
    }
  };

  const handleEdit = (customerId: string | null, customerEmail: string | null, storeName: string) => {
    console.log("Edit customer:", customerId, customerEmail, storeName);
  };

  const handleDelete = (customerId: string | null, customerEmail: string | null, storeName: string) => {
    console.log("Delete customer:", customerId, customerEmail, storeName);
  };

  const hasActiveFilters =
    filters.store ||
    filters.customerEmail ||
    filters.customerName ||
    filters.status ||
    filters.startDate ||
    filters.endDate ||
    filters.minGenerations !== undefined ||
    filters.maxGenerations !== undefined;

  const activeFilterCount = [
    filters.store,
    filters.customerEmail,
    filters.customerName,
    filters.status,
    filters.startDate,
    filters.endDate,
    filters.minGenerations !== undefined,
    filters.maxGenerations !== undefined,
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Customers
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.totalCustomers}
                    </div>
                    <p className="text-xs text-muted-foreground">All stores</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Generations
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.totalGenerations}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.storesCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Active stores</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg. Generations
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
                      {summary.averageGenerationsPerCustomer.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">Per customer</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-500" />
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
                  Customer List
                </CardTitle>
                {pagination && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {pagination.total} total {pagination.total === 1 ? "customer" : "customers"}
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
                  {filters.store && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveStoreFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveStoreFilter();
                        }
                      }}
                    >
                      <span>Store: {formatShopName(filters.store || "")}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.customerEmail && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveEmailFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveEmailFilter();
                        }
                      }}
                    >
                      <span>Email: {filters.customerEmail}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.customerName && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveNameFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveNameFilter();
                        }
                      }}
                    >
                      <span>Name: {filters.customerName}</span>
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
                  {filters.startDate && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveDateFilter("startDate")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveDateFilter("startDate");
                        }
                      }}
                    >
                      <span>From: {new Date(filters.startDate).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.endDate && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveDateFilter("endDate")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveDateFilter("endDate");
                        }
                      }}
                    >
                      <span>To: {new Date(filters.endDate).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.minGenerations !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveGenerationsFilter("min")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveGenerationsFilter("min");
                        }
                      }}
                    >
                      <span>Min: {filters.minGenerations}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.maxGenerations !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveGenerationsFilter("max")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveGenerationsFilter("max");
                        }
                      }}
                    >
                      <span>Max: {filters.maxGenerations}</span>
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
                      <Label htmlFor="store" className="text-sm font-medium">
                        Store
                      </Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="store"
                          type="text"
                          placeholder="example.myshopify.com"
                          value={filters.store || ""}
                          onChange={(e) => handleStoreChange(e.target.value)}
                          className="pl-9 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="text-sm font-medium">
                        Customer Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="customer@example.com"
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
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="customerName"
                          type="text"
                          placeholder="John Doe"
                          value={filters.customerName || ""}
                          onChange={(e) => handleCustomerNameChange(e.target.value)}
                          className="pl-9 h-10"
                        />
                      </div>
                    </div>

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
                      <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={filters.startDate || ""}
                        onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
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
                        value={filters.endDate || ""}
                        onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minGenerations" className="text-sm font-medium">
                        Min Generations
                      </Label>
                      <Input
                        id="minGenerations"
                        type="number"
                        placeholder="0"
                        value={filters.minGenerations !== undefined ? filters.minGenerations : ""}
                        onChange={(e) => handleMinGenerationsChange(e.target.value)}
                        className="h-10"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxGenerations" className="text-sm font-medium">
                        Max Generations
                      </Label>
                      <Input
                        id="maxGenerations"
                        type="number"
                        placeholder="100"
                        value={filters.maxGenerations !== undefined ? filters.maxGenerations : ""}
                        onChange={(e) => handleMaxGenerationsChange(e.target.value)}
                        className="h-10"
                        min="0"
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
                    {error.error?.message || "An error occurred while fetching customers"}
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
                            onClick={() => handleColumnSort("name")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Customer
                            {getSortIcon("name")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("store")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Store
                            {getSortIcon("store")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("lastActivity")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Last Activity
                            {getSortIcon("lastActivity")}
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
                              <Skeleton className="h-4 w-24 sm:w-32" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-24 sm:w-32" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-24 sm:w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={4} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-3">
                              <Users className="h-12 w-12 text-muted-foreground opacity-50" />
                              <div>
                                <p className="text-sm font-medium">No customers found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try adjusting your filters
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((customer) => (
                          <TableRow
                            key={`${customer.customerEmail || "unknown"}-${customer.storeName}`}
                            className="border-b hover:bg-transparent"
                          >
                            <TableCell className="py-4">
                              {customer.fullName || customer.customerEmail ? (
                                <div className="flex flex-col space-y-0.5">
                                  {customer.fullName && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (customer.fullName) {
                                          handleCustomerNameChange(customer.fullName);
                                        }
                                      }}
                                      className="text-sm font-medium text-left hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 underline-offset-4 hover:underline"
                                      aria-label={`Filter by customer: ${customer.fullName}`}
                                    >
                                      {customer.fullName}
                                    </button>
                                  )}
                                  {customer.customerEmail && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleCustomerEmailChange(customer.customerEmail!);
                                      }}
                                      className="text-xs text-muted-foreground text-left hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 underline-offset-4 hover:underline"
                                      aria-label={`Filter by email: ${customer.customerEmail}`}
                                    >
                                      {customer.customerEmail}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              {customer.storeName ? (
                                <a
                                  href={`https://${customer.storeName}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  {formatShopName(customer.storeName)}
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                {formatDate(customer.lastActivity)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() =>
                                  handleView(
                                    customer.customerId,
                                    customer.customerEmail,
                                    customer.storeName
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View customer</span>
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
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedImage(null);
            }
          }}
        >
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 gap-0 bg-background border border-border shadow-2xl overflow-hidden sm:rounded-xl">
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
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Customers;
