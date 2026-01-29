import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchImageGenerations } from "@/store/slices/imageGenerationsSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Package, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusItemProps {
  label: string;
  count: number;
  total: number;
  color: string;
  loading?: boolean;
}

const StatusItem = ({ label, count, total, color, loading }: StatusItemProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{label}</span>
        <span className="text-sm text-muted-foreground">
          {count} ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export const GenerationStatusBreakdown = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  const {
    summary,
    loading,
  } = useAppSelector((state) => state.imageGenerations);

  useEffect(() => {
    const filters: any = { page: 1, limit: 1 };
    if (viewMode === "store" && selectedStore) {
      filters.storeName = selectedStore.replace(/\.myshopify\.com$/i, "");
    }
    dispatch(fetchImageGenerations(filters));
  }, [dispatch, viewMode, selectedStore]);

  if (!summary && !loading) {
    return null;
  }

  const statusBreakdown = summary?.statusBreakdown || {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  };

  const total = Object.values(statusBreakdown).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generation Status
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/generations")}
          className="gap-2"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <StatusItem
              key={index}
              label=""
              count={0}
              total={0}
              color=""
              loading={true}
            />
          ))
        ) : total === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No generations yet</p>
          </div>
        ) : (
          <>
            <StatusItem
              label="Completed"
              count={statusBreakdown.completed}
              total={total}
              color="green"
            />
            <StatusItem
              label="Processing"
              count={statusBreakdown.processing}
              total={total}
              color="blue"
            />
            <StatusItem
              label="Pending"
              count={statusBreakdown.pending}
              total={total}
              color="yellow"
            />
            <StatusItem
              label="Failed"
              count={statusBreakdown.failed}
              total={total}
              color="red"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const ProductStatusBreakdown = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { viewMode, selectedStore } = useAppSelector((state) => state.viewMode);

  const {
    records: products,
    pagination,
    loading,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    const filters: any = { page: 1, limit: 100 };
    if (viewMode === "store" && selectedStore) {
      filters.shop = selectedStore;
    }
    dispatch(fetchProducts(filters));
  }, [dispatch, viewMode, selectedStore]);

  // Calculate status breakdown from products
  const statusBreakdown = {
    active: products.filter((p) => p.status === "ACTIVE").length,
    archived: products.filter((p) => p.status === "ARCHIVED").length,
    draft: products.filter((p) => p.status === "DRAFT").length,
  };

  const total = Object.values(statusBreakdown).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Product Status
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/products")}
          className="gap-2"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <StatusItem
              key={index}
              label=""
              count={0}
              total={0}
              color=""
              loading={true}
            />
          ))
        ) : total === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No products yet</p>
          </div>
        ) : (
          <>
            <StatusItem
              label="Active"
              count={statusBreakdown.active}
              total={total}
              color="green"
            />
            <StatusItem
              label="Draft"
              count={statusBreakdown.draft}
              total={total}
              color="yellow"
            />
            <StatusItem
              label="Archived"
              count={statusBreakdown.archived}
              total={total}
              color="gray"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

