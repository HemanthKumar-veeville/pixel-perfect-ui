import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
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
  Coins,
  Sparkles,
  Store,
  Search,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Cpu,
  Gift,
  ShoppingCart,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStoresCredits,
  setPage,
  setLimit,
  setSearch,
  setPlanHandle,
  setBalanceRange,
  setHasActivePlan,
  setPlanType,
  setDateRange,
  setSorting,
  resetFilters,
  clearError,
} from "@/store/slices/storesCreditsSlice";
import { cn } from "@/lib/utils";

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

const formatShopName = (shop: string) => {
  if (!shop) return "N/A";
  return shop.replace(/\.myshopify\.com$/i, "");
};

const Credits = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    records,
    pagination,
    summary,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.storesCredits);

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStoresCredits(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearch(search || undefined));
  };

  const handlePlanHandleChange = (planHandle: string) => {
    dispatch(setPlanHandle(planHandle || undefined));
  };

  const handleMinBalanceChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    dispatch(setBalanceRange({ minBalance: numValue }));
  };

  const handleMaxBalanceChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    dispatch(setBalanceRange({ maxBalance: numValue }));
  };

  const handleHasActivePlanChange = (value: string) => {
    if (value === "all") {
      dispatch(setHasActivePlan(undefined));
    } else {
      dispatch(setHasActivePlan(value === "true"));
    }
  };

  const handlePlanTypeChange = (planType: string) => {
    dispatch(setPlanType(planType === "all" ? undefined : (planType as "monthly" | "annual")));
  };

  const handleDateRangeChange = (field: "startDate" | "endDate", value: string) => {
    dispatch(
      setDateRange({
        [field]: value || undefined,
      })
    );
  };

  const handleColumnSort = (field: "shopDomain" | "creditBalance" | "planPeriodEnd") => {
    const currentField = filters.orderBy || "updatedAt";
    const currentDirection = filters.orderDirection || "DESC";

    if (currentField === field) {
      const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
      dispatch(setSorting({ orderBy: field, orderDirection: newDirection }));
    } else {
      dispatch(setSorting({ orderBy: field, orderDirection: "DESC" }));
    }
  };

  const getSortIcon = (field: "shopDomain" | "creditBalance" | "planPeriodEnd") => {
    const currentField = filters.orderBy || "updatedAt";

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

  const handleRemoveSearchFilter = () => {
    dispatch(setSearch(undefined));
  };

  const handleRemovePlanHandleFilter = () => {
    dispatch(setPlanHandle(undefined));
  };

  const handleRemoveBalanceFilter = (type: "min" | "max") => {
    if (type === "min") {
      dispatch(setBalanceRange({ minBalance: undefined }));
    } else {
      dispatch(setBalanceRange({ maxBalance: undefined }));
    }
  };

  const handleRemoveHasActivePlanFilter = () => {
    dispatch(setHasActivePlan(undefined));
  };

  const handleRemovePlanTypeFilter = () => {
    dispatch(setPlanType(undefined));
  };

  const handleRemoveDateFilter = (type: "startDate" | "endDate") => {
    if (type === "startDate") {
      dispatch(setDateRange({ startDate: undefined }));
    } else {
      dispatch(setDateRange({ endDate: undefined }));
    }
  };

  const handleView = (shopDomain: string) => {
    navigate(`/credits/${encodeURIComponent(shopDomain)}`);
  };

  const handleEdit = (shopDomain: string) => {
    navigate(`/credits/${encodeURIComponent(shopDomain)}`);
  };

  const handleDelete = (shopDomain: string) => {
    console.log("Delete store credits:", shopDomain);
  };

  const hasActiveFilters =
    filters.search ||
    filters.planHandle ||
    filters.minBalance !== undefined ||
    filters.maxBalance !== undefined ||
    filters.hasActivePlan !== undefined ||
    filters.planType ||
    filters.startDate ||
    filters.endDate;

  const activeFilterCount = [
    filters.search,
    filters.planHandle,
    filters.minBalance !== undefined,
    filters.maxBalance !== undefined,
    filters.hasActivePlan !== undefined,
    filters.planType,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Credits</h1>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.totalStores}
                    </div>
                    <p className="text-xs text-muted-foreground">All stores</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Credit Balance
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-700 dark:text-indigo-300">
                      {summary.totalCreditBalance.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">AI generation credits</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Stores with Plan
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-700 dark:text-cyan-300">
                      {summary.storesWithActivePlan}
                    </div>
                    <p className="text-xs text-muted-foreground">Active plans</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                    <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg. Balance
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
                      {summary.averageCreditBalance.toFixed(0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Per store</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 dark:text-emerald-400" />
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
                  Stores Credits
                </CardTitle>
                {pagination && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {pagination.total} total {pagination.total === 1 ? "store" : "stores"}
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
                  {filters.planHandle && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemovePlanHandleFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemovePlanHandleFilter();
                        }
                      }}
                    >
                      <span>Plan: {filters.planHandle}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.minBalance !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveBalanceFilter("min")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveBalanceFilter("min");
                        }
                      }}
                    >
                      <span>Min: {filters.minBalance}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.maxBalance !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleRemoveBalanceFilter("max")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveBalanceFilter("max");
                        }
                      }}
                    >
                      <span>Max: {filters.maxBalance}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.hasActivePlan !== undefined && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemoveHasActivePlanFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveHasActivePlanFilter();
                        }
                      }}
                    >
                      <span>Active Plan: {filters.hasActivePlan ? "Yes" : "No"}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.planType && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={handleRemovePlanTypeFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemovePlanTypeFilter();
                        }
                      }}
                    >
                      <span className="capitalize">Type: {filters.planType}</span>
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
                          placeholder="Search by shop domain..."
                          value={filters.search || ""}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="pl-9 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="planHandle" className="text-sm font-medium">
                        Plan Handle
                      </Label>
                      <Input
                        id="planHandle"
                        type="text"
                        placeholder="e.g., growth-monthly"
                        value={filters.planHandle || ""}
                        onChange={(e) => handlePlanHandleChange(e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minBalance" className="text-sm font-medium">
                        Min Balance
                      </Label>
                      <Input
                        id="minBalance"
                        type="number"
                        placeholder="0"
                        value={filters.minBalance !== undefined ? filters.minBalance : ""}
                        onChange={(e) => handleMinBalanceChange(e.target.value)}
                        className="h-10"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxBalance" className="text-sm font-medium">
                        Max Balance
                      </Label>
                      <Input
                        id="maxBalance"
                        type="number"
                        placeholder="10000"
                        value={filters.maxBalance !== undefined ? filters.maxBalance : ""}
                        onChange={(e) => handleMaxBalanceChange(e.target.value)}
                        className="h-10"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hasActivePlan" className="text-sm font-medium">
                        Active Plan
                      </Label>
                      <Select
                        value={
                          filters.hasActivePlan === undefined
                            ? "all"
                            : filters.hasActivePlan
                            ? "true"
                            : "false"
                        }
                        onValueChange={handleHasActivePlanChange}
                      >
                        <SelectTrigger id="hasActivePlan" className="h-10">
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
                      <Label htmlFor="planType" className="text-sm font-medium">
                        Plan Type
                      </Label>
                      <Select
                        value={filters.planType || "all"}
                        onValueChange={handlePlanTypeChange}
                      >
                        <SelectTrigger id="planType" className="h-10">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
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
                    {error.error?.message || "An error occurred while fetching stores credits"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Table Section */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <Table>
                    <TableHeader>
                      {/* Main Header Row */}
                      <TableRow className="border-b hover:bg-transparent">
                        <TableHead
                          rowSpan={2}
                          className="h-12 font-semibold align-middle border-r"
                        >
                          <button
                            type="button"
                            onClick={() => handleColumnSort("shopDomain")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Store
                            {getSortIcon("shopDomain")}
                          </button>
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 font-semibold text-center border-b border-r bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30"
                        >
                          <button
                            type="button"
                            onClick={() => handleColumnSort("creditBalance")}
                            className="flex items-center justify-center gap-2 hover:text-foreground transition-colors cursor-pointer group mx-auto"
                          >
                            <span className="text-indigo-700 dark:text-indigo-300">Total Credits</span>
                            {getSortIcon("creditBalance")}
                          </button>
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 font-semibold text-center border-b border-r bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30"
                        >
                          <span className="text-cyan-700 dark:text-cyan-300">Plan Credits</span>
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 font-semibold text-center border-b border-r bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
                        >
                          <span className="text-amber-700 dark:text-amber-300">Coupon Credits</span>
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 font-semibold text-center border-b border-r bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
                        >
                          <span className="text-emerald-700 dark:text-emerald-300">Purchased Credits</span>
                        </TableHead>
                        <TableHead
                          rowSpan={2}
                          className="h-12 font-semibold align-middle hidden md:table-cell border-r"
                        >
                          <button
                            type="button"
                            onClick={() => handleColumnSort("planPeriodEnd")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Period End
                            {getSortIcon("planPeriodEnd")}
                          </button>
                        </TableHead>
                        <TableHead rowSpan={2} className="h-12 font-semibold text-center align-middle">
                          Actions
                        </TableHead>
                      </TableRow>
                      {/* Sub-header Row */}
                      <TableRow className="border-b hover:bg-transparent">
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                          Balance
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                          Used
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                          Credited
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
                          Balance
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
                          Used
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
                          Credited
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                          Balance
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                          Used
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                          Credited
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                          Balance
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                          Used
                        </TableHead>
                        <TableHead className="h-10 font-medium text-center text-xs border-r bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                          Credited
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index} className="hover:bg-transparent">
                            <TableCell className="border-r">
                              <Skeleton className="h-4 w-24 sm:w-32" />
                            </TableCell>
                            {/* Total Credits */}
                            <TableCell className="text-center border-r bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            {/* Plan Credits */}
                            <TableCell className="text-center border-r bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            {/* Coupon Credits */}
                            <TableCell className="text-center border-r bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            {/* Purchased Credits */}
                            <TableCell className="text-center border-r bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center border-r bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                              <Skeleton className="h-4 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell border-r">
                              <Skeleton className="h-4 w-24 sm:w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded mx-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={14} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-3">
                              <Coins className="h-12 w-12 text-muted-foreground opacity-50" />
                              <div>
                                <p className="text-sm font-medium">No stores found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try adjusting your filters
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((store) => (
                          <TableRow
                            key={store.shopDomain}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            {/* Store Name */}
                            <TableCell className="py-4 border-r">
                              <a
                                href={`https://${store.shopDomain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                {formatShopName(store.shopDomain)}
                              </a>
                            </TableCell>
                            {/* Total Credits */}
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                {store.creditBalance.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                {store.creditsUsedThisPeriod.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {(
                                  store.planCreditsCredited +
                                  store.couponCreditsCredited +
                                  store.purchasedCreditsCredited
                                ).toLocaleString()}
                              </span>
                            </TableCell>
                            {/* Plan Credits */}
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                {store.planCreditsBalance.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                              <span className="text-sm text-red-600 dark:text-red-400">
                                {store.planCreditsUsedThisPeriod.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {store.planCreditsCredited.toLocaleString()}
                              </span>
                            </TableCell>
                            {/* Coupon Credits */}
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                {store.couponCreditsBalance.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                              <span className="text-sm text-red-600 dark:text-red-400">
                                {store.couponCreditsUsedThisPeriod.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {store.couponCreditsCredited.toLocaleString()}
                              </span>
                            </TableCell>
                            {/* Purchased Credits */}
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                {store.purchasedCreditsBalance.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                              <span className="text-sm text-red-600 dark:text-red-400">
                                {store.purchasedCreditsUsedThisPeriod.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-4 border-r bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {store.purchasedCreditsCredited.toLocaleString()}
                              </span>
                            </TableCell>
                            {/* Period End */}
                            <TableCell className="hidden md:table-cell py-4 border-r">
                              {store.planPeriodEnd ? (
                                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                  {new Date(store.planPeriodEnd).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            {/* Actions */}
                            <TableCell className="text-center py-4">
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
                                  <DropdownMenuItem onClick={() => handleView(store.shopDomain)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(store.shopDomain)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(store.shopDomain)}
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
    </DashboardLayout>
  );
};

export default Credits;
