import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStores } from "@/store/slices/storesSlice";
import { fetchStoreCredits, updateStoreCredits, clearData } from "@/store/slices/creditsSlice";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  Coins,
  CreditCard,
  Gift,
  ShoppingCart,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { UpdateCreditsRequest } from "@/services/creditsService";

const formatShopName = (shop: string) => {
  if (!shop) return "N/A";
  return shop.replace(/\.myshopify\.com$/i, "");
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StorePage = () => {
  const dispatch = useAppDispatch();
  const { selectedStore } = useAppSelector((state) => state.viewMode);
  const { records: stores, loading: storesLoading, error: storesError } = useAppSelector(
    (state) => state.stores
  );
  const { data: creditsData, loading: creditsLoading, error: creditsError, updating } =
    useAppSelector((state) => state.credits);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<"balance" | "used">("balance");
  const [editCreditType, setEditCreditType] = useState<"plan" | "coupon" | "purchased">("plan");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUsedValue, setEditUsedValue] = useState("");
  const [editUsedPeriodValue, setEditUsedPeriodValue] = useState("");

  const store = stores.length > 0 ? stores[0] : null;

  useEffect(() => {
    if (selectedStore) {
      dispatch(fetchStores({ shop: selectedStore }));
      dispatch(fetchStoreCredits(selectedStore));
    }
    return () => {
      dispatch(clearData());
    };
  }, [selectedStore, dispatch]);

  useEffect(() => {
    if (storesError) {
      toast.error(storesError.error?.message || "Failed to load store");
    }
  }, [storesError]);

  useEffect(() => {
    if (creditsError) {
      toast.error(creditsError.error?.message || "Failed to load credits");
    }
  }, [creditsError]);

  const handleEditBalance = (creditType: "plan" | "coupon" | "purchased") => {
    setEditType("balance");
    setEditCreditType(creditType);
    setEditValue("");
    setEditDescription("");
    setEditDialogOpen(true);
  };

  const handleEditUsed = (creditType: "plan" | "coupon" | "purchased") => {
    setEditType("used");
    setEditCreditType(creditType);
    setEditUsedValue("");
    setEditUsedPeriodValue("");
    setEditDescription("");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedStore || !creditsData) return;

    let updateData: UpdateCreditsRequest = {
      description: editDescription || undefined,
    };

    if (editType === "balance") {
      const value = parseFloat(editValue);
      if (isNaN(value)) {
        toast.error("Please enter a valid number");
        return;
      }
      if (editCreditType === "plan") {
        updateData.addPlanCredits = value;
      } else if (editCreditType === "coupon") {
        updateData.addCouponCredits = value;
      } else {
        updateData.addPurchasedCredits = value;
      }
    } else {
      if (editUsedValue) {
        const value = parseFloat(editUsedValue);
        if (isNaN(value) || value < 0) {
          toast.error("Lifetime used must be a valid non-negative number");
          return;
        }
        if (editCreditType === "plan") {
          updateData.planCreditsUsed = value;
        } else if (editCreditType === "coupon") {
          updateData.couponCreditsUsed = value;
        } else {
          updateData.purchasedCreditsUsed = value;
        }
      }
      if (editUsedPeriodValue) {
        const value = parseFloat(editUsedPeriodValue);
        if (isNaN(value) || value < 0) {
          toast.error("Period used must be a valid non-negative number");
          return;
        }
        if (editCreditType === "plan") {
          updateData.planCreditsUsedThisPeriod = value;
        } else if (editCreditType === "coupon") {
          updateData.couponCreditsUsedThisPeriod = value;
        } else {
          updateData.purchasedCreditsUsedThisPeriod = value;
        }
      }
    }

    try {
      await dispatch(updateStoreCredits({ shopDomain: selectedStore, data: updateData })).unwrap();
      toast.success("Credits updated successfully");
      setEditDialogOpen(false);
      setEditValue("");
      setEditUsedValue("");
      setEditUsedPeriodValue("");
      setEditDescription("");
    } catch (err) {
      // Error is handled by useEffect
    }
  };

  const getCurrentBalance = () => {
    if (!creditsData) return 0;
    if (editCreditType === "plan") return creditsData.creditTypes.plan.balance;
    if (editCreditType === "coupon") return creditsData.creditTypes.coupon.balance;
    return creditsData.creditTypes.purchased.balance;
  };

  const isLoading = storesLoading || creditsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedStore) {
    return (
      <DashboardLayout>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No store selected. Please select a store from the dropdown.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (!store) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {storesError?.error?.message || "Failed to load store data"}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{formatShopName(store.shop)}</h1>
              <p className="text-sm text-muted-foreground mt-1">{store.shop}</p>
            </div>
          </div>
          <Badge variant={store.isActive ? "default" : "secondary"} className="gap-2">
            {store.isActive ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Inactive
              </>
            )}
          </Badge>
        </div>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Details about your Shopify store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-xs text-muted-foreground">Store Name</Label>
                <div className="text-sm font-medium mt-1">{store.name || "N/A"}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="text-sm font-medium mt-1">
                  {store.isOnline ? "Online" : "Offline"}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Installed At</Label>
                <div className="text-sm font-medium mt-1">{formatDate(store.installedAt)}</div>
              </div>
              {store.uninstalledAt && (
                <div>
                  <Label className="text-xs text-muted-foreground">Uninstalled At</Label>
                  <div className="text-sm font-medium mt-1">{formatDate(store.uninstalledAt)}</div>
                </div>
              )}
              {store.appUrl && (
                <div>
                  <Label className="text-xs text-muted-foreground">App URL</Label>
                  <div className="text-sm font-medium mt-1">
                    <a
                      href={store.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Credits Summary */}
        {creditsData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {creditsData.summary.total.balance.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Available credits</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Credited
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {creditsData.summary.total.credited.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {creditsData.summary.total.used.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Used This Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {creditsData.summary.total.usedThisPeriod.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current billing period</p>
                </CardContent>
              </Card>
            </div>

            {/* Credit Management Tabs */}
            <Tabs defaultValue="credits" className="space-y-4">
              <TabsList>
                <TabsTrigger value="credits">Credit Types</TabsTrigger>
                <TabsTrigger value="plan">Plan Information</TabsTrigger>
                <TabsTrigger value="overage">Overage</TabsTrigger>
              </TabsList>

              {/* Credit Types Tab */}
              <TabsContent value="credits" className="space-y-4">
                {/* Plan Credits */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <CardTitle>Plan Credits</CardTitle>
                          <CardDescription>Credits from subscription plan</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBalance("plan")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Add/Subtract
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditUsed("plan")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Used
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Balance</Label>
                        <div className="text-lg font-semibold mt-1">
                          {creditsData.creditTypes.plan.balance.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Credited</Label>
                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          {creditsData.creditTypes.plan.credited.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Used (Lifetime)</Label>
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                          {creditsData.creditTypes.plan.used.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Used (This Period)</Label>
                        <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                          {creditsData.creditTypes.plan.usedThisPeriod.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coupon Credits */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle>Coupon Credits</CardTitle>
                          <CardDescription>Credits from promotional coupons</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBalance("coupon")}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Add/Subtract
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditUsed("coupon")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Used
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Balance</Label>
                        <div className="text-lg font-semibold mt-1">
                          {creditsData.creditTypes.coupon.balance.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Credited</Label>
                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          {creditsData.creditTypes.coupon.credited.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Used (Lifetime)</Label>
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                          {creditsData.creditTypes.coupon.used.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Used (This Period)</Label>
                        <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                          {creditsData.creditTypes.coupon.usedThisPeriod.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Purchased Credits */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle>Purchased Credits</CardTitle>
                          <CardDescription>Credits purchased directly</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBalance("purchased")}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Add/Subtract
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUsed("purchased")}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Used
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Balance</Label>
                        <div className="text-lg font-semibold mt-1">
                          {creditsData.creditTypes.purchased.balance.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Credited</Label>
                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          {creditsData.creditTypes.purchased.credited.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Used (Lifetime)</Label>
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                          {creditsData.creditTypes.purchased.used.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Used (This Period)</Label>
                        <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                          {creditsData.creditTypes.purchased.usedThisPeriod.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Plan Information Tab */}
              <TabsContent value="plan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>Current plan details and billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-xs text-muted-foreground">Current Plan</Label>
                        <div className="text-sm font-medium mt-1">
                          {creditsData.plan.currentPlanHandle || "No active plan"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Plan Type</Label>
                        <div className="text-sm font-medium mt-1">
                          {creditsData.plan.isMonthly && "Monthly"}
                          {creditsData.plan.isAnnual && "Annual"}
                          {!creditsData.plan.isMonthly && !creditsData.plan.isAnnual && "N/A"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <div className="text-sm font-medium mt-1">
                          <Badge variant={creditsData.plan.status === "ACTIVE" ? "default" : "secondary"}>
                            {creditsData.plan.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Period Start</Label>
                        <div className="text-sm font-medium mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(creditsData.plan.planPeriodStart)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Period End</Label>
                        <div className="text-sm font-medium mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(creditsData.plan.planPeriodEnd)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Overage Tab */}
              <TabsContent value="overage" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Overage Usage</CardTitle>
                    <CardDescription>Usage beyond plan limits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-xs text-muted-foreground">Usage This Month</Label>
                        <div className="text-lg font-semibold mt-1">
                          {creditsData.overage.usageThisMonth.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Capped Amount</Label>
                        <div className="text-lg font-semibold mt-1">
                          {creditsData.overage.cappedAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Remaining</Label>
                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          {creditsData.overage.remaining.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Monthly Period End</Label>
                        <div className="text-sm font-medium mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(creditsData.overage.monthlyPeriodEnd)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Edit Credits Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editType === "balance" ? "Add/Subtract Credits" : "Edit Used Credits"}
              </DialogTitle>
              <DialogDescription>
                {editType === "balance"
                  ? `Current balance: ${getCurrentBalance().toLocaleString()} credits`
                  : `Edit ${editCreditType} credits usage`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {editType === "balance" ? (
                <div className="space-y-2">
                  <Label htmlFor="value">
                    Amount (positive to add, negative to subtract)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="0"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="used">Lifetime Used</Label>
                    <Input
                      id="used"
                      type="number"
                      placeholder="Leave empty to keep current"
                      value={editUsedValue}
                      onChange={(e) => setEditUsedValue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usedPeriod">Used This Period</Label>
                    <Input
                      id="usedPeriod"
                      type="number"
                      placeholder="Leave empty to keep current"
                      value={editUsedPeriodValue}
                      onChange={(e) => setEditUsedPeriodValue(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a note about this change..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StorePage;
