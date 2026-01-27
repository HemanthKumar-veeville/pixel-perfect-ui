import { useEffect, useState } from "react";
import { Search, Loader2, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedStore,
  clearSelectedStore,
  fetchStoresForSelector,
  clearError,
} from "@/store/slices/viewModeSlice";
import { cn } from "@/lib/utils";

const formatShopName = (shop: string) => {
  return shop.replace(/\.myshopify\.com$/i, "");
};

export const StoreSelector = () => {
  const dispatch = useAppDispatch();
  const { selectedStore, stores, loading, error } = useAppSelector(
    (state) => state.viewMode
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch stores when component mounts or when opened
    if (isOpen && stores.length === 0 && !loading) {
      dispatch(fetchStoresForSelector());
    }
  }, [isOpen, stores.length, loading, dispatch]);

  const handleStoreChange = (value: string) => {
    if (value === "clear") {
      dispatch(clearSelectedStore());
    } else {
      dispatch(setSelectedStore(value));
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  // Filter stores based on search query
  const filteredStores = stores.filter((store) =>
    store.shop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStoreRecord = stores.find((s) => s.shop === selectedStore);

  if (error) {
    return (
      <div className="space-y-2 px-2">
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">
            {error.error?.message || "Failed to load stores"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            dispatch(clearError());
            dispatch(fetchStoresForSelector());
          }}
          className="w-full text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select
        value={selectedStore || undefined}
        onValueChange={handleStoreChange}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          className={cn(
            "w-full h-9 text-sm bg-sidebar-accent/30 border-sidebar-border hover:bg-sidebar-accent/50 [&>svg:last-child]:hidden focus:ring-0 focus:ring-offset-0 focus:outline-none",
            !selectedStore && "text-muted-foreground"
          )}
          aria-label="Select store to filter data"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {loading && stores.length === 0 ? (
              <Skeleton className="h-4 w-24" />
            ) : selectedStore ? (
              <span className="truncate">
                {selectedStoreRecord?.name ||
                  formatShopName(selectedStore)}
              </span>
            ) : (
              <SelectValue placeholder="Select Store..." />
            )}
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </SelectTrigger>
        <SelectContent className="w-[var(--radix-select-trigger-width)]">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {loading && stores.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                Loading stores...
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery ? "No stores found" : "No stores available"}
              </div>
            ) : (
              filteredStores.map((store) => (
                <SelectItem
                  key={store.shop}
                  value={store.shop}
                  className="cursor-pointer pl-2 [&>span:first-child]:hidden"
                >
                  <div className="flex flex-col py-0.5">
                    <span className="font-medium text-sm">
                      {store.name || formatShopName(store.shop)}
                    </span>
                    {store.name && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {formatShopName(store.shop)}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

