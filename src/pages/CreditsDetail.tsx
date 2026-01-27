import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Coins,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Gift,
  ShoppingCart,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStoreCredits,
  updateStoreCredits,
  clearError,
  clearData,
} from "@/store/slices/creditsSlice";
import { toast } from "sonner";
import type { UpdateCreditsRequest } from "@/services/creditsService";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShopName = (shop: string) => {
  if (!shop) return "N/A";
  return shop.replace(/\.myshopify\.com$/i, "");
};

const CreditsDetail = () => {
  const { shopDomain } = useParams<{ shopDomain: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading, error, updating, updateError } = useAppSelector(
    (state) => state.credits
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<"balance" | "used">("balance");
  const [editCreditType, setEditCreditType] = useState<"plan" | "coupon" | "purchased">("plan");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUsedValue, setEditUsedValue] = useState("");
  const [editUsedPeriodValue, setEditUsedPeriodValue] = useState("");

  useEffect(() => {
    if (shopDomain) {
      dispatch(fetchStoreCredits(shopDomain));
    }
    return () => {
      dispatch(clearData());
    };
  }, [shopDomain, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.error?.message || "Failed to load credits");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.error?.message || "Failed to update credits");
    }
  }, [updateError]);

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
    if (!shopDomain || !data) return;

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
      await dispatch(updateStoreCredits({ shopDomain, data: updateData })).unwrap();
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
    if (!data) return 0;
    if (editCreditType === "plan") return data.creditTypes.plan.balance;
    if (editCreditType === "coupon") return data.creditTypes.coupon.balance;
    return data.creditTypes.purchased.balance;
  };

  const getCurrentUsed = () => {
    if (!data) return 0;
    if (editCreditType === "plan") return data.creditTypes.plan.used;
    if (editCreditType === "coupon") return data.creditTypes.coupon.used;
    return data.creditTypes.purchased.used;
  };

  const getCurrentUsedPeriod = () => {
    if (!data) return 0;
    if (editCreditType === "plan") return data.creditTypes.plan.usedThisPeriod;
    if (editCreditType === "coupon") return data.creditTypes.coupon.usedThisPeriod;
    return data.creditTypes.purchased.usedThisPeriod;
  };

  if (loading) {
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

  if (!data) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/credits")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Credits
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.error?.message || "Failed to load credits data"}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/credits")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {formatShopName(data.shopDomain)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{data.shopDomain}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.total.balance.toLocaleString()}</div>
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
                {data.summary.total.credited.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.summary.total.used.toLocaleString()}
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
                {data.summary.total.usedThisPeriod.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current billing period</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBalance("plan")}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Add/Subtract
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUsed("plan")}
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
                      {data.creditTypes.plan.balance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Credited</Label>
                    <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {data.creditTypes.plan.credited.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Used (Lifetime)</Label>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                      {data.creditTypes.plan.used.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Used (This Period)</Label>
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                      {data.creditTypes.plan.usedThisPeriod.toLocaleString()}
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
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUsed("coupon")}
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
                      {data.creditTypes.coupon.balance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Credited</Label>
                    <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {data.creditTypes.coupon.credited.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Used (Lifetime)</Label>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                      {data.creditTypes.coupon.used.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Used (This Period)</Label>
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                      {data.creditTypes.coupon.usedThisPeriod.toLocaleString()}
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
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle>Purchased Credits</CardTitle>
                      <CardDescription>One-time purchased credits</CardDescription>
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
                      {data.creditTypes.purchased.balance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Credited</Label>
                    <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {data.creditTypes.purchased.credited.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Used (Lifetime)</Label>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                      {data.creditTypes.purchased.used.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Used (This Period)</Label>
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                      {data.creditTypes.purchased.usedThisPeriod.toLocaleString()}
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
                <CardTitle>Plan Information</CardTitle>
                <CardDescription>Current subscription plan details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-muted-foreground">Plan Handle</Label>
                    <div className="mt-1">
                      {data.plan.currentPlanHandle ? (
                        <Badge variant="secondary" className="text-sm">
                          {data.plan.currentPlanHandle}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No plan</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge
                        variant={data.plan.status === "ACTIVE" ? "default" : "secondary"}
                        className="text-sm"
                      >
                        {data.plan.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Plan Type</Label>
                    <div className="mt-1 flex items-center gap-2">
                      {data.plan.isMonthly && (
                        <Badge variant="outline" className="text-sm">
                          Monthly
                        </Badge>
                      )}
                      {data.plan.isAnnual && (
                        <Badge variant="outline" className="text-sm">
                          Annual
                        </Badge>
                      )}
                      {!data.plan.isMonthly && !data.plan.isAnnual && (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Interval</Label>
                    <div className="mt-1">
                      <span className="text-sm">
                        {data.plan.interval || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Period Start</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(data.plan.planPeriodStart)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Period End</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(data.plan.planPeriodEnd)}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Subscription Line Item ID</Label>
                    <div className="mt-1">
                      <span className="text-sm font-mono text-muted-foreground">
                        {data.plan.subscriptionLineItemId || "N/A"}
                      </span>
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
                <CardTitle>Overage Tracking</CardTitle>
                <CardDescription>
                  Monthly overage usage tracking (Annual plans only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-muted-foreground">Usage This Month</Label>
                    <div className="text-2xl font-bold mt-1">
                      ${data.overage.usageThisMonth.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">USD</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Capped Amount</Label>
                    <div className="text-2xl font-bold mt-1">
                      ${data.overage.cappedAmount.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">USD</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Remaining</Label>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      ${data.overage.remaining.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">USD</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Monthly Period End</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(data.overage.monthlyPeriodEnd)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Created At</Label>
                <div className="mt-1">{formatDate(data.metadata.createdAt)}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Updated At</Label>
                <div className="mt-1">{formatDate(data.metadata.updatedAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editType === "balance"
                  ? `Add/Subtract ${editCreditType.charAt(0).toUpperCase() + editCreditType.slice(1)} Credits`
                  : `Edit ${editCreditType.charAt(0).toUpperCase() + editCreditType.slice(1)} Credits Used`}
              </DialogTitle>
              <DialogDescription>
                {editType === "balance"
                  ? `Add or subtract credits. Use positive values to add, negative values to subtract. Current balance: ${getCurrentBalance().toLocaleString()}`
                  : `Update lifetime and period usage. Current used (lifetime): ${getCurrentUsed().toLocaleString()}, Current used (period): ${getCurrentUsedPeriod().toLocaleString()}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {editType === "balance" ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-value">Amount to Add/Subtract</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Enter amount (negative to subtract)"
                  />
                  {editValue && !isNaN(parseFloat(editValue)) && (
                    <p className="text-xs text-muted-foreground">
                      New balance will be:{" "}
                      <span className="font-semibold">
                        {(getCurrentBalance() + parseFloat(editValue)).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-used-lifetime">Lifetime Used</Label>
                    <Input
                      id="edit-used-lifetime"
                      type="number"
                      min="0"
                      value={editUsedValue}
                      onChange={(e) => setEditUsedValue(e.target.value)}
                      placeholder="Enter lifetime used (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-used-period">Used This Period</Label>
                    <Input
                      id="edit-used-period"
                      type="number"
                      min="0"
                      value={editUsedPeriodValue}
                      onChange={(e) => setEditUsedPeriodValue(e.target.value)}
                      placeholder="Enter period used (optional)"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a note for this update..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={updating}>
                {updating ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CreditsDetail;

