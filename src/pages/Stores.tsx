import { useEffect, useState } from "react";
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
  Search,
  ChevronDown,
  Store,
  CheckCircle2,
  XCircle,
  Globe,
  Calendar,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStores,
  setLimit,
  setOffset,
  setSearch,
  resetFilters,
  clearError,
} from "@/store/slices/storesSlice";
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
  if (!shop) return "-";
  return shop.replace(/\.myshopify\.com$/i, "");
};

const Stores = () => {
  const dispatch = useAppDispatch();
  const {
    records,
    pagination,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.stores);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    dispatch(fetchStores(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Sync searchInput with filters.search when it changes externally
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        dispatch(setSearch(searchInput || undefined));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search, dispatch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(searchInput || undefined));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handlePageChange = (direction: "prev" | "next") => {
    if (!pagination) return;
    if (direction === "prev" && filters.offset > 0) {
      dispatch(setOffset(Math.max(0, filters.offset - filters.limit)));
    } else if (direction === "next" && pagination.hasMore) {
      dispatch(setOffset(filters.offset + filters.limit));
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchInput("");
  };

  const handleRemoveSearchFilter = () => {
    dispatch(setSearch(undefined));
    setSearchInput("");
  };

  const handleView = (shop: string) => {
    console.log("View store:", shop);
  };

  const handleEdit = (shop: string) => {
    console.log("Edit store:", shop);
  };

  const handleDelete = (shop: string) => {
    console.log("Delete store:", shop);
  };

  const hasActiveFilters = filters.search;

  const currentPage = pagination
    ? Math.floor(filters.offset / filters.limit) + 1
    : 1;
  const totalPages = pagination
    ? Math.ceil(pagination.total / filters.limit)
    : 1;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Stores</h1>
        </div>

        {/* Summary Cards */}
        {pagination && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {pagination.total}
                    </div>
                    <p className="text-xs text-muted-foreground">All stores</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
                      {records.filter((store) => store.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Currently active</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Online Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {records.filter((store) => store.isOnline).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Currently online</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Inactive Stores
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-red-600 dark:text-red-500">
                      {records.filter((store) => !store.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Uninstalled</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 dark:text-red-500" />
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
                  Store List
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
                      {hasActiveFilters && (
                        <Badge
                          variant="secondary"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-semibold bg-primary text-primary-foreground"
                        >
                          1
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
                      className="gap-1.5 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={handleRemoveSearchFilter}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRemoveSearchFilter();
                        }
                      }}
                      aria-label={`Remove search filter: ${filters.search}`}
                    >
                      <span>Search: {filters.search}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              )}

              {/* Filters Section */}
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleContent className="space-y-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 border-b">
                    <div className="space-y-2">
                      <Label htmlFor="search" className="text-sm font-medium">
                        Search Store
                      </Label>
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="search"
                          placeholder="Search by shop domain"
                          value={searchInput}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="pl-9 h-10"
                        />
                      </form>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error.error?.message || "An error occurred while fetching stores"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Table Section */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b hover:bg-transparent">
                        <TableHead className="h-12 font-semibold">Shop Name</TableHead>
                        <TableHead className="h-12 font-semibold">Store</TableHead>
                        <TableHead className="h-12 font-semibold">Status</TableHead>
                        <TableHead className="h-12 font-semibold hidden lg:table-cell">Installed</TableHead>
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
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={5} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-3">
                              <Store className="h-12 w-12 text-muted-foreground opacity-50" />
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
                            key={store.shop}
                            className="border-b hover:bg-transparent"
                          >
                            <TableCell className="py-4">
                              {store.name ? (
                                <span className="text-sm sm:text-base font-medium">
                                  {store.name}
                                </span>
                              ) : (
                                <span className="text-sm sm:text-base text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <a
                                href={`https://${store.shop}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm sm:text-base font-medium text-primary hover:underline"
                              >
                                {formatShopName(store.shop)}
                              </a>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  store.isActive
                                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                    : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                )}
                              >
                                {store.isActive ? (
                                  <>
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDate(store.installedAt)}
                                </span>
                              </div>
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
                                  <DropdownMenuItem onClick={() => handleView(store.shop)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(store.shop)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(store.shop)}
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="limit" className="text-sm text-muted-foreground">
                      Show:
                    </Label>
                    <Select
                      value={String(filters.limit)}
                      onValueChange={(value) => handleLimitChange(Number(value))}
                    >
                      <SelectTrigger id="limit" className="h-9 w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      per page
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {filters.offset + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(filters.offset + filters.limit, pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
                    {pagination.total === 1 ? "result" : "results"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange("prev")}
                      disabled={filters.offset === 0 || loading}
                      className="gap-2 h-9"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>
                    <div className="flex items-center gap-1 px-4 py-2 rounded-md bg-muted text-sm font-medium min-w-[100px] justify-center">
                      <span className="text-muted-foreground">Page</span>{" "}
                      <span className="font-semibold">{currentPage}</span>
                      <span className="text-muted-foreground">of</span>{" "}
                      <span className="font-semibold">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange("next")}
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
      </div>
    </DashboardLayout>
  );
};

export default Stores;
