export type GenerationStatus = "pending" | "processing" | "completed" | "failed";
export type OrderBy = "created_at" | "updated_at" | "status";
export type OrderDirection = "ASC" | "DESC";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  status?: GenerationStatus;
  user?: string;
  storeName?: string;
  start_date?: string;
  end_date?: string;
  customerEmail?: string;
  customerName?: string;
}

export interface SortParams {
  orderBy?: OrderBy;
  orderDirection?: OrderDirection;
}

export interface ImageGenerationRecord {
  id: string;
  requestId: string;
  personImageUrl: string;
  clothingImageUrl: string;
  generatedImageUrl: string;
  generatedImageKey: string;
  status: GenerationStatus;
  errorMessage: string | null;
  processingTime: string | null;
  fileSize: string;
  mimeType: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  name: string;
  email: string;
  storeName: string;
  customerId: string | null;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  clothingKey: string;
  personKey: string;
  productId: string | null;
  productTitle: string | null;
  productUrl: string | null;
  variantId: string | null;
  aspectRatio: string | null;
  createdAt: string;
  updatedAt: string;
  addToCartInfo: {
    addedToCart: boolean;
    cartAddedAt: string | null;
    productId: string | null;
    variantId: string | null;
  } | null;
  otherProductsAddedToCart: Array<{
    productId: string;
    variantId: string;
    addedAt: string;
  }> | null;
}

export interface VideoGenerationRecord {
  id: string;
  requestId: string;
  inputImagesCount: number;
  inputImagesUrls: string[];
  generatedVideoUrl: string | null;
  generatedVideoKey: string | null;
  status: GenerationStatus;
  errorMessage: string | null;
  processingTime: string | null;
  fileSize: string;
  mimeType: string;
  durationSeconds: number;
  userAgent: string | null;
  ipAddress: string | null;
  name: string;
  email: string;
  storeName: string;
  clothingKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StatusBreakdown {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface ImageGenerationsSummary {
  generationsCount: number;
  customersCount: number;
  productsCount: number;
  statusBreakdown: StatusBreakdown;
}

export interface ImageGenerationsResponse {
  status: "success";
  data: {
    records: ImageGenerationRecord[];
    pagination: PaginationMeta;
    summary: ImageGenerationsSummary;
  };
}

export interface VideoGenerationsResponse {
  status: "success";
  data: {
    records: VideoGenerationRecord[];
    pagination: PaginationMeta;
  };
}

export interface ApiError {
  status: "error";
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ImageGenerationsQueryParams
  extends PaginationParams,
    FilterParams,
    SortParams {}

export interface VideoGenerationsQueryParams
  extends PaginationParams,
    Pick<FilterParams, "status" | "user">,
    SortParams {}

// Store types based on API spec
export interface StoreRecord {
  shop: string;
  name: string | null;
  scope: string | null;
  isOnline: boolean;
  expires: string | null;
  sessionId: string | null;
  state: string | null;
  apiKey: string | null;
  appUrl: string | null;
  installedAt: string;
  uninstalledAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  accessToken?: string | null; // Only included in single store response
}

export interface StoresPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface StoresListResponse {
  success: true;
  message: string;
  data: StoreRecord[];
  pagination: StoresPagination;
}

export interface StoreSingleResponse {
  success: true;
  message: string;
  data: StoreRecord;
}

export type StoresResponse = StoresListResponse | StoreSingleResponse;

export interface StoresQueryParams {
  shop?: string; // If provided, returns single store
  limit?: number; // Default: 50, Max: 100
  offset?: number; // Default: 0
  search?: string; // Search by shop domain (case-insensitive partial match)
}

// Customer types based on API spec
export interface CustomerRecord {
  customerId: string | null;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  fullName: string | null;
  storeName: string;
  totalGenerations: number;
  completedGenerations: number;
  failedGenerations: number;
  pendingGenerations: number;
  processingGenerations: number;
  firstActivity: string;
  lastActivity: string;
  lastGenerationId: string | null;
  lastGenerationUrl: string | null;
}

export interface CustomersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CustomersSummary {
  totalCustomers: number;
  totalGenerations: number;
  storesCount: number;
  averageGenerationsPerCustomer: number;
}

export interface CustomersListResponse {
  success: true;
  data: CustomerRecord[];
  pagination: CustomersPagination;
  summary: CustomersSummary;
}

export interface CustomersQueryParams {
  store?: string;
  customerEmail?: string;
  customerName?: string;
  customerId?: string;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  minGenerations?: number;
  maxGenerations?: number;
  status?: GenerationStatus;
  page?: number; // Default: 1
  limit?: number; // Default: 50, Max: 100
  orderBy?: "email" | "name" | "firstActivity" | "lastActivity" | "totalGenerations" | "store";
  orderDirection?: OrderDirection;
}

// Stores Credits types based on API spec
export interface StoreCreditRecord {
  shopDomain: string;
  planCreditsBalance: number;
  couponCreditsBalance: number;
  purchasedCreditsBalance: number;
  creditBalance: number;
  planCreditsUsed: number;
  couponCreditsUsed: number;
  purchasedCreditsUsed: number;
  creditsUsedThisPeriod: number;
  planCreditsUsedThisPeriod: number;
  couponCreditsUsedThisPeriod: number;
  purchasedCreditsUsedThisPeriod: number;
  planCreditsCredited: number;
  couponCreditsCredited: number;
  purchasedCreditsCredited: number;
  currentPlanHandle: string | null;
  planPeriodStart: string | null;
  planPeriodEnd: string | null;
  subscriptionLineItemId: string | null;
  overageUsageThisMonth: number | null;
  monthlyPeriodEnd: string | null;
  overageCappedAmount: number | null;
  lastThresholdNotified80: string | null;
  lastThresholdNotified90: string | null;
  lastThresholdNotified100: string | null;
  isAnnualPlan: boolean;
  isMonthlyPlan: boolean;
  planType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoresCreditsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StoresCreditsSummary {
  totalStores: number;
  totalCreditBalance: number;
  totalPlanCredits: number;
  totalCouponCredits: number;
  totalPurchasedCredits: number;
  totalCreditsUsed: number;
  storesWithActivePlan: number;
  storesWithoutPlan: number;
  averageCreditBalance: number;
}

export interface StoresCreditsListResponse {
  success: true;
  data: StoreCreditRecord[];
  pagination: StoresCreditsPagination;
  summary: StoresCreditsSummary;
}

export interface StoresCreditsQueryParams {
  shop?: string; // Filter by shop domain
  search?: string;
  planHandle?: string;
  minBalance?: number;
  maxBalance?: number;
  hasActivePlan?: boolean;
  planType?: "monthly" | "annual";
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  page?: number; // Default: 1
  limit?: number; // Default: 50, Max: 100
  orderBy?: "shopDomain" | "creditBalance" | "planCreditsBalance" | "couponCreditsBalance" | "purchasedCreditsBalance" | "creditsUsedThisPeriod" | "currentPlanHandle" | "planPeriodStart" | "planPeriodEnd" | "updatedAt" | "createdAt";
  orderDirection?: OrderDirection;
}

// Products types based on API spec
export type ProductStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

export interface ProductPrice {
  amount: string;
  currencyCode: string;
}

export interface ProductPriceRange {
  min: ProductPrice;
  max: ProductPrice;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ProductVariantSelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
  inventoryQuantity: number;
  inventoryPolicy: string;
  image: ProductImage | null;
  selectedOptions: ProductVariantSelectedOption[];
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductSEO {
  title: string | null;
  description: string | null;
}

export interface ProductCollection {
  id: string;
  title: string;
  handle: string;
}

export interface ProductRecord {
  id: number;
  shopDomain: string;
  shopifyProductId: string;
  title: string;
  handle: string;
  description: string | null;
  descriptionHtml: string | null;
  vendor: string | null;
  productType: string | null;
  status: ProductStatus;
  tags: string[];
  onlineStoreUrl: string | null;
  onlineStorePreviewUrl: string | null;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  hasOutOfStockVariants: boolean;
  priceRange: ProductPriceRange | null;
  compareAtPriceRange: ProductPriceRange | null;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
  media: unknown[];
  seo: ProductSEO | null;
  collections: ProductCollection[];
  shopifyCreatedAt: string;
  shopifyUpdatedAt: string;
  shopifyPublishedAt: string | null;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ProductsListResponse {
  success: true;
  data: ProductRecord[];
  pagination: ProductsPagination;
  filters: {
    shop: string | null;
    status: string | null;
    vendor: string | null;
    productType: string | null;
    search: string | null;
    start_date: string | null;
    end_date: string | null;
    dateField: string | null;
    minInventory: string | null;
    maxInventory: string | null;
    hasOutOfStock: string | null;
  };
  requestId: string;
}

export interface ProductsQueryParams {
  shop?: string;
  status?: ProductStatus;
  vendor?: string;
  productType?: string;
  search?: string;
  start_date?: string; // Format: YYYY-MM-DD or ISO
  end_date?: string; // Format: YYYY-MM-DD or ISO
  dateField?: "created_at" | "updated_at" | "last_synced_at" | "shopify_updated_at";
  minInventory?: number;
  maxInventory?: number;
  hasOutOfStock?: boolean | string;
  page?: number; // Default: 1
  limit?: number; // Default: 50, Max: 100
  orderBy?: "created_at" | "updated_at" | "last_synced_at" | "title" | "vendor" | "product_type" | "status" | "total_inventory" | "shopify_updated_at";
  orderDirection?: OrderDirection;
}

export interface ProductSyncData {
  success: boolean;
  shopDomain: string;
  totalProducts: number;
  created: number;
  updated: number;
  errors: number;
  syncType: "full" | "incremental";
  syncReason: string;
  requestId: string;
}

export interface ProductSyncResponse {
  success: boolean;
  message: string;
  data: ProductSyncData;
  requestId: string;
}

