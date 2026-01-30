import { useEffect, useState, useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ShoppingCart,
  Calendar,
  Search,
  Store,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cartTrackingService } from "@/services/cartTrackingService";
import { cn } from "@/lib/utils";
import type { CartTrackingQueryParams, CartTrackingError } from "@/types/api";
import type { ViewMode } from "@/store/slices/viewModeSlice";
import { useAppSelector } from "@/store/hooks";

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

const CartEvents = () => {
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CartTrackingError | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<CartTrackingQueryParams>({
    page: 1,
    limit: 50,
    orderBy: "created_at",
    orderDirection: "DESC",
  });

  // Auto-apply store filter when in Store View
  useEffect(() => {
    if (viewMode === "store" && selectedStore) {
      setFilters((prev) => ({ ...prev, storeName: selectedStore }));
    } else if (viewMode === "admin") {
      setFilters((prev) => {
        const { storeName, ...rest } = prev;
        return rest;
      });
    }
  }, [viewMode, selectedStore]);

  useEffect(() => {
    const fetchCartEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await cartTrackingService.getAllCartEvents(filters);
        if (response.status === "success") {
          setRecords(response.data.records);
          setPagination(response.data.pagination);
          setSummary(response.data.summary);
        }
      } catch (err) {
        const apiError = err as CartTrackingError;
        setError(apiError);
        toast.error(
          apiError?.message?.reason ||
            apiError?.message?.message ||
            apiError?.error ||
            "Failed to fetch cart events"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCartEvents();
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleColumnSort = (field: string) => {
    const currentField = filters.orderBy || "created_at";
    const currentDirection = filters.orderDirection || "DESC";

    if (currentField === field) {
      const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
      setFilters((prev) => ({
        ...prev,
        orderBy: field as CartTrackingQueryParams["orderBy"],
        orderDirection: newDirection,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        orderBy: field as CartTrackingQueryParams["orderBy"],
        orderDirection: "DESC",
      }));
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
    setFilters({
      page: 1,
      limit: 50,
      orderBy: "created_at",
      orderDirection: "DESC",
      ...(viewMode === "store" && selectedStore && { storeName: selectedStore }),
    });
  };

  const hasActiveFilters =
    filters.storeName ||
    filters.customerId ||
    filters.actionType ||
    filters.productId ||
    filters.variantId ||
    filters.startDate ||
    filters.endDate;

  const activeFilterCount = [
    filters.storeName,
    filters.customerId,
    filters.actionType,
    filters.productId,
    filters.variantId,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Cart Events</h1>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Events
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {summary.eventsCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">All cart events</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
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
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                      {summary.customersCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Unique customers</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Products
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-700 dark:text-green-300">
                      {summary.productsCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Unique products</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
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
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-purple-700 dark:text-purple-300">
                      {summary.storesCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Unique stores</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
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
                  All Cart Events
                </CardTitle>
                {pagination && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {pagination.total} total {pagination.total === 1 ? "event" : "events"}
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
                  {filters.storeName && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() =>
                        setFilters((prev) => {
                          const { storeName, ...rest } = prev;
                          return rest;
                        })
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFilters((prev) => {
                            const { storeName, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                    >
                      <span>Store: {formatShopName(filters.storeName)}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.actionType && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() =>
                        setFilters((prev) => {
                          const { actionType, ...rest } = prev;
                          return rest;
                        })
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <span className="capitalize">
                        Action: {filters.actionType.replace(/_/g, " ")}
                      </span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.startDate && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() =>
                        setFilters((prev) => {
                          const { startDate, ...rest } = prev;
                          return rest;
                        })
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <span>From: {new Date(filters.startDate).toLocaleDateString()}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.endDate && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() =>
                        setFilters((prev) => {
                          const { endDate, ...rest } = prev;
                          return rest;
                        })
                      }
                      role="button"
                      tabIndex={0}
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
                    {viewMode === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="storeName" className="text-sm font-medium">
                          Store Name
                        </Label>
                        <Input
                          id="storeName"
                          type="text"
                          placeholder="example.myshopify.com"
                          value={filters.storeName || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              storeName: e.target.value || undefined,
                              page: 1,
                            }))
                          }
                          className="h-10"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="actionType" className="text-sm font-medium">
                        Action Type
                      </Label>
                      <Select
                        value={filters.actionType || "all"}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            actionType: value === "all" ? undefined : value,
                            page: 1,
                          }))
                        }
                      >
                        <SelectTrigger id="actionType" className="h-10">
                          <SelectValue placeholder="All Actions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                          <SelectItem value="buy_now">Buy Now</SelectItem>
                          <SelectItem value="remove_from_cart">Remove from Cart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerId" className="text-sm font-medium">
                        Customer ID
                      </Label>
                      <Input
                        id="customerId"
                        type="text"
                        placeholder="456789012"
                        value={filters.customerId || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            customerId: e.target.value || undefined,
                            page: 1,
                          }))
                        }
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productId" className="text-sm font-medium">
                        Product ID
                      </Label>
                      <Input
                        id="productId"
                        type="text"
                        placeholder="123456789"
                        value={filters.productId || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            productId: e.target.value || undefined,
                            page: 1,
                          }))
                        }
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variantId" className="text-sm font-medium">
                        Variant ID
                      </Label>
                      <Input
                        id="variantId"
                        type="text"
                        placeholder="987654321"
                        value={filters.variantId || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            variantId: e.target.value || undefined,
                            page: 1,
                          }))
                        }
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
                        value={filters.startDate || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            startDate: e.target.value || undefined,
                            page: 1,
                          }))
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
                        value={filters.endDate || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            endDate: e.target.value || undefined,
                            page: 1,
                          }))
                        }
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
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {error?.message?.reason ||
                      error?.message?.message ||
                      error?.error ||
                      "An error occurred while fetching cart events"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Table Section */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b hover:bg-transparent">
                        {viewMode === "admin" && (
                          <TableHead className="h-12 font-semibold">Store</TableHead>
                        )}
                        <TableHead className="h-12 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("action_type")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Action Type
                            {getSortIcon("action_type")}
                          </button>
                        </TableHead>
                        <TableHead className="h-12 font-semibold">Product</TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          Variant ID
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">
                          Customer ID
                        </TableHead>
                        <TableHead className="h-12 font-semibold hidden md:table-cell">
                          <button
                            type="button"
                            onClick={() => handleColumnSort("created_at")}
                            className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer group"
                          >
                            Created At
                            {getSortIcon("created_at")}
                          </button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index} className="hover:bg-transparent">
                            {viewMode === "admin" && (
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                            )}
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell
                            colSpan={viewMode === "admin" ? 6 : 5}
                            className="text-center py-12 sm:py-16"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50" />
                              <div>
                                <p className="text-sm font-medium">No cart events found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try adjusting your filters
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((event) => (
                          <TableRow
                            key={event.id}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            {viewMode === "admin" && (
                              <TableCell className="py-4">
                                <a
                                  href={`https://${event.storeName}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-primary hover:underline"
                                >
                                  {formatShopName(event.storeName)}
                                </a>
                              </TableCell>
                            )}
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className="text-xs font-medium capitalize"
                              >
                                {event.actionType
                                  ? event.actionType.replace(/_/g, " ")
                                  : "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                {event.productTitle ? (
                                  <>
                                    <span className="text-sm font-medium">
                                      {event.productTitle}
                                    </span>
                                    {event.productId && (
                                      <span className="text-xs text-muted-foreground">
                                        ID: {event.productId}
                                      </span>
                                    )}
                                  </>
                                ) : event.productId ? (
                                  <span className="text-sm text-muted-foreground">
                                    ID: {event.productId}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              <span className="text-sm text-muted-foreground">
                                {event.variantId || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              <span className="text-sm text-muted-foreground">
                                {event.customerId || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4">
                              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                {formatDate(event.createdAt)}
                              </span>
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
                    <span className="font-semibold text-foreground">
                      {pagination.total}
                    </span>{" "}
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

export default CartEvents;

