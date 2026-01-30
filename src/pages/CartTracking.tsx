import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, ShoppingCart, CheckCircle2, AlertCircle } from "lucide-react";
import { cartTrackingService } from "@/services/cartTrackingService";
import type { CartTrackingError } from "@/types/api";

const trackCartEventSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .refine(
      (val) => {
        const normalized = val.toLowerCase().trim();
        return (
          normalized.includes(".myshopify.com") ||
          /^[a-z0-9-]+$/.test(normalized)
        );
      },
      {
        message: "Store name must be a valid Shopify domain or store name",
      }
    ),
  actionType: z.string().max(100).optional(),
  productId: z.union([z.string(), z.number()]).optional(),
  productTitle: z.string().max(500).optional(),
  productUrl: z
    .string()
    .url("Product URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  variantId: z.union([z.string(), z.number()]).optional(),
  customerId: z.union([z.string(), z.number()]).optional(),
});

type TrackCartEventFormData = z.infer<typeof trackCartEventSchema>;

const CartTracking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TrackCartEventFormData>({
    resolver: zodResolver(trackCartEventSchema),
    defaultValues: {
      actionType: "add_to_cart",
    },
  });

  const actionType = watch("actionType");

  const onSubmit = async (data: TrackCartEventFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Clean up empty strings
      const payload = {
        storeName: data.storeName,
        ...(data.actionType && { actionType: data.actionType }),
        ...(data.productId && { productId: data.productId }),
        ...(data.productTitle && { productTitle: data.productTitle }),
        ...(data.productUrl && data.productUrl !== "" && { productUrl: data.productUrl }),
        ...(data.variantId && { variantId: data.variantId }),
        ...(data.customerId && { customerId: data.customerId }),
      };

      const response = await cartTrackingService.trackCartEvent(payload);

      if (response.success === true) {
        setSuccess(true);
        toast.success(response.message || "Cart event tracked successfully");
        reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      const apiError = err as CartTrackingError;
      const errorMessage =
        (typeof apiError?.message === "object"
          ? apiError?.message?.reason ||
            apiError?.message?.message ||
            apiError?.message?.code
          : apiError?.message) ||
        apiError?.error ||
        "Failed to track cart event. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Track Cart Event</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track when a product is added to cart after virtual try-on
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart Event Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to track a cart event. Store name is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="font-medium text-green-800 dark:text-green-200">
                    Cart event tracked successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Name - Required */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="storeName" className="text-sm font-semibold">
                    Store Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="example.myshopify.com or example"
                    className="h-11"
                    {...register("storeName")}
                    aria-invalid={errors.storeName ? "true" : "false"}
                    aria-describedby={errors.storeName ? "storeName-error" : undefined}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                  {errors.storeName && (
                    <p
                      id="storeName-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.storeName.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter store name (will be normalized to .myshopify.com format)
                  </p>
                </div>

                {/* Action Type */}
                <div className="space-y-2">
                  <Label htmlFor="actionType" className="text-sm font-semibold">
                    Action Type
                  </Label>
                  <Select
                    value={actionType || "add_to_cart"}
                    onValueChange={(value) => setValue("actionType", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="actionType" className="h-11">
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                      <SelectItem value="buy_now">Buy Now</SelectItem>
                      <SelectItem value="remove_from_cart">Remove from Cart</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.actionType && (
                    <p
                      id="actionType-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.actionType.message}
                    </p>
                  )}
                </div>

                {/* Product ID */}
                <div className="space-y-2">
                  <Label htmlFor="productId" className="text-sm font-semibold">
                    Product ID
                  </Label>
                  <Input
                    id="productId"
                    type="text"
                    placeholder="123456789"
                    className="h-11"
                    {...register("productId", {
                      setValueAs: (value) => {
                        if (!value || value === "") return undefined;
                        const num = Number(value);
                        return isNaN(num) ? value : num;
                      },
                    })}
                    aria-invalid={errors.productId ? "true" : "false"}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                  {errors.productId && (
                    <p
                      id="productId-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.productId.message}
                    </p>
                  )}
                </div>

                {/* Product Title */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productTitle" className="text-sm font-semibold">
                    Product Title
                  </Label>
                  <Input
                    id="productTitle"
                    type="text"
                    placeholder="Blue Denim Jacket"
                    className="h-11"
                    {...register("productTitle")}
                    aria-invalid={errors.productTitle ? "true" : "false"}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    maxLength={500}
                  />
                  {errors.productTitle && (
                    <p
                      id="productTitle-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.productTitle.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Maximum 500 characters
                  </p>
                </div>

                {/* Product URL */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productUrl" className="text-sm font-semibold">
                    Product URL
                  </Label>
                  <Input
                    id="productUrl"
                    type="url"
                    placeholder="https://example.myshopify.com/products/blue-denim-jacket"
                    className="h-11"
                    {...register("productUrl")}
                    aria-invalid={errors.productUrl ? "true" : "false"}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                  {errors.productUrl && (
                    <p
                      id="productUrl-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.productUrl.message}
                    </p>
                  )}
                </div>

                {/* Variant ID */}
                <div className="space-y-2">
                  <Label htmlFor="variantId" className="text-sm font-semibold">
                    Variant ID
                  </Label>
                  <Input
                    id="variantId"
                    type="text"
                    placeholder="987654321"
                    className="h-11"
                    {...register("variantId", {
                      setValueAs: (value) => {
                        if (!value || value === "") return undefined;
                        const num = Number(value);
                        return isNaN(num) ? value : num;
                      },
                    })}
                    aria-invalid={errors.variantId ? "true" : "false"}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                  {errors.variantId && (
                    <p
                      id="variantId-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.variantId.message}
                    </p>
                  )}
                </div>

                {/* Customer ID */}
                <div className="space-y-2">
                  <Label htmlFor="customerId" className="text-sm font-semibold">
                    Customer ID
                  </Label>
                  <Input
                    id="customerId"
                    type="text"
                    placeholder="456789012"
                    className="h-11"
                    {...register("customerId", {
                      setValueAs: (value) => {
                        if (!value || value === "") return undefined;
                        const num = Number(value);
                        return isNaN(num) ? value : num;
                      },
                    })}
                    aria-invalid={errors.customerId ? "true" : "false"}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                  {errors.customerId && (
                    <p
                      id="customerId-error"
                      className="text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {errors.customerId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 text-base font-semibold"
                  disabled={loading}
                  aria-label="Track cart event"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Track Event
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto h-11"
                  onClick={() => {
                    reset();
                    setError(null);
                    setSuccess(false);
                  }}
                  disabled={loading}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CartTracking;

