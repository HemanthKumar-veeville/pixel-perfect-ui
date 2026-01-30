import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Mail,
  Store,
  UserCircle,
  Sparkles,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Package,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { customersService } from "@/services/customersService";
import { cartTrackingService } from "@/services/cartTrackingService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type {
  CustomerRecord,
  CustomerOrdersResponse,
  ApiError,
  CartTrackingCustomerResponse,
  CartTrackingError,
} from "@/types/api";

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
  if (!shopDomain) return "N/A";
  return shopDomain.replace(/\.myshopify\.com$/i, "");
};

const formatCurrency = (amount: string | number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
};

const getFinancialStatusBadgeStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "PARTIALLY_PAID":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "VOIDED":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const getFulfillmentStatusBadgeStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "FULFILLED":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "UNFULFILLED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "PARTIAL":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const CustomerDetail = () => {
  const { customerId, customerEmail, storeName } = useParams<{
    customerId: string;
    customerEmail: string;
    storeName: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Get customer data from location state (passed from Customers page)
  const customerData = location.state?.customer as CustomerRecord | undefined;

  const [customer, setCustomer] = useState<CustomerRecord | null>(customerData || null);
  const [orders, setOrders] = useState<CustomerOrdersResponse | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<ApiError | null>(null);
  const [cartEvents, setCartEvents] = useState<CartTrackingCustomerResponse | null>(null);
  const [cartEventsLoading, setCartEventsLoading] = useState(false);
  const [cartEventsError, setCartEventsError] = useState<CartTrackingError | null>(null);

  useEffect(() => {
    // If customer data wasn't passed via state, we'd need to fetch it
    // For now, we'll use the passed data
    if (!customer && customerId && storeName) {
      // In a real scenario, you might want to fetch customer details here
      // For now, we'll show an error if no customer data is available
    }
  }, [customer, customerId, storeName]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId || !storeName) return;

      setOrdersLoading(true);
      setOrdersError(null);

      try {
        const response = await customersService.getCustomerOrders(
          storeName,
          customerId,
          { limit: 50, reverse: true }
        );
        setOrders(response);
      } catch (error) {
        const apiError = error as ApiError;
        setOrdersError(apiError);
        toast.error(apiError.error?.message || "Failed to load customer orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    if (customerId && storeName) {
      fetchOrders();
    }
  }, [customerId, storeName]);

  useEffect(() => {
    const fetchCartEvents = async () => {
      if (!customerId || !storeName) return;

      setCartEventsLoading(true);
      setCartEventsError(null);

      try {
        const response = await cartTrackingService.getCartEventsByCustomerAndStore(
          customerId,
          storeName,
          { limit: 50, orderBy: "created_at", orderDirection: "DESC" }
        );
        setCartEvents(response);
      } catch (error) {
        const apiError = error as CartTrackingError;
        setCartEventsError(apiError);
        // Don't show toast for cart events errors as it's optional data
      } finally {
        setCartEventsLoading(false);
      }
    };

    if (customerId && storeName) {
      fetchCartEvents();
    }
  }, [customerId, storeName]);

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/customers")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Customer data not found. Please navigate from the customers list.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  const totalOrderValue = orders?.data?.reduce((sum, order) => {
    return sum + order.totals.total.amount;
  }, 0) || 0;

  const currencyCode = orders?.data?.[0]?.totals?.total?.currencyCode || "USD";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/customers")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {customer.fullName || customer.customerEmail || "Customer"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {customer.customerEmail && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.customerEmail}</span>
                  </div>
                )}
                {customer.storeName && (
                  <a
                    href={`https://${customer.storeName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Store className="h-4 w-4" />
                    <span>{formatShopName(customer.storeName)}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Generations
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {customer.totalGenerations}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
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
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-green-700 dark:text-green-300">
                    {customer.completedGenerations}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {customer.totalGenerations > 0
                      ? `${Math.round((customer.completedGenerations / customer.totalGenerations) * 100)}% success rate`
                      : "No generations"}
                  </p>
                </div>
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                    {orders?.data?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">From Shopify</p>
                </div>
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-purple-700 dark:text-purple-300">
                    {formatCurrency(totalOrderValue.toString(), currencyCode)}
                  </div>
                  <p className="text-xs text-muted-foreground">Order value</p>
                </div>
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">
              Orders
              {orders?.data?.length ? (
                <Badge variant="secondary" className="ml-2">
                  {orders.data.length}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="generations">
              Generations
              {customer.totalGenerations > 0 ? (
                <Badge variant="secondary" className="ml-2">
                  {customer.totalGenerations}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="cart-events">
              Cart Events
              {cartEvents?.data?.summary?.eventsCount ? (
                <Badge variant="secondary" className="ml-2">
                  {cartEvents.data.summary.eventsCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </Label>
                    <p className="text-sm font-medium">
                      {customer.fullName || customer.customerFirstName || customer.customerLastName
                        ? `${customer.customerFirstName || ""} ${customer.customerLastName || ""}`.trim() || "N/A"
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm font-medium">
                      {customer.customerEmail || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Customer ID
                    </Label>
                    <p className="text-sm font-medium font-mono">
                      {customer.customerId || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Store
                    </Label>
                    <a
                      href={`https://${customer.storeName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {formatShopName(customer.storeName)}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      First Activity
                    </Label>
                    <p className="text-sm font-medium">
                      {formatDate(customer.firstActivity)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Last Activity
                    </Label>
                    <p className="text-sm font-medium">
                      {formatDate(customer.lastActivity)}
                    </p>
                  </div>
                  {customer.lastGenerationUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Generation
                      </Label>
                      <a
                        href={customer.lastGenerationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
                      >
                        <span>View Image</span>
                        <TrendingUp className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Generation Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Generation Statistics</CardTitle>
                <CardDescription>
                  Breakdown of generation statuses for this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {customer.completedGenerations}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {customer.failedGenerations}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {customer.pendingGenerations}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {customer.processingGenerations}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">
                      {customer.totalGenerations}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Orders</CardTitle>
                <CardDescription>
                  Orders placed by this customer from Shopify
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 w-full" />
                    ))}
                  </div>
                ) : ordersError ? (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {ordersError.error?.message || "Failed to load orders"}
                    </AlertDescription>
                  </Alert>
                ) : !orders?.data || orders.data.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                    <p className="text-sm font-medium">No orders found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This customer hasn't placed any orders yet
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Financial Status</TableHead>
                          <TableHead>Fulfillment Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.data.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.name}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(order.createdAt)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  getFinancialStatusBadgeStyles(order.financialStatus)
                                )}
                              >
                                {order.financialStatus.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  getFulfillmentStatusBadgeStyles(order.fulfillmentStatus)
                                )}
                              >
                                {order.fulfillmentStatus.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(
                                order.totals.total.amount.toString(),
                                order.totals.total.currencyCode
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {orders.pagination?.hasNextPage && (
                      <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          Showing {orders.data.length} orders. More orders available.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generations Tab */}
          <TabsContent value="generations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generations</CardTitle>
                <CardDescription>
                  View all generations for this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                  <p className="text-sm font-medium">View Generations</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Navigate to the Generations page to see all generations for this customer
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate("/generations", {
                        state: {
                          filters: {
                            customerEmail: customer.customerEmail,
                            storeName: customer.storeName,
                          },
                        },
                      })
                    }
                  >
                    View All Generations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cart Events Tab */}
          <TabsContent value="cart-events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cart Events</CardTitle>
                <CardDescription>
                  Cart tracking events for this customer from this store
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cartEventsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 w-full" />
                    ))}
                  </div>
                ) : cartEventsError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {cartEventsError?.message?.reason ||
                        cartEventsError?.error ||
                        "Failed to load cart events"}
                    </AlertDescription>
                  </Alert>
                ) : !cartEvents?.data?.records ||
                  cartEvents.data.records.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                    <p className="text-sm font-medium">No cart events found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This customer hasn't triggered any cart events yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartEvents.data.summary && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Total Events</p>
                          <p className="text-2xl font-bold">
                            {cartEvents.data.summary.eventsCount}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Customer ID</p>
                          <p className="text-sm font-medium font-mono">
                            {cartEvents.data.summary.customerId}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Store</p>
                          <p className="text-sm font-medium">
                            {formatShopName(cartEvents.data.summary.storeName)}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action Type</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="hidden md:table-cell">Variant ID</TableHead>
                            <TableHead className="hidden lg:table-cell">Product URL</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cartEvents.data.records.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-medium capitalize"
                                >
                                  {event.actionType
                                    ? event.actionType.replace(/_/g, " ")
                                    : "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell>
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
                              <TableCell className="hidden md:table-cell">
                                <span className="text-sm text-muted-foreground">
                                  {event.variantId || "-"}
                                </span>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {event.productUrl ? (
                                  <a
                                    href={event.productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline truncate block max-w-xs"
                                  >
                                    {event.productUrl}
                                  </a>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDate(event.createdAt)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {cartEvents.data.pagination?.hasNext && (
                      <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          Showing {cartEvents.data.records.length} of{" "}
                          {cartEvents.data.pagination.total} events
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDetail;

