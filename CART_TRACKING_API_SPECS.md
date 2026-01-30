# Cart Tracking API Specifications

## Overview
The Cart Tracking API enables tracking and retrieval of cart events when products are added to cart after virtual try-on. This enables conversion tracking from try-on to cart addition.

**Base URL:** `/api/cart-tracking`

---

## Endpoints

### 1. Track Cart Event
**Create a new cart tracking event**

#### Endpoint
```
POST /api/cart-tracking/track
```

#### Purpose
Tracks when a product is added to cart after virtual try-on. This enables conversion tracking from try-on to cart addition.

#### Headers
```
Content-Type: application/json
```

#### Request Body

**Required Fields:**
- `storeName` (string) - Store name (will be normalized to `.myshopify.com` format)

**Optional Fields:**
- `actionType` (string, max 100 chars) - Type of cart action (e.g., "add_to_cart", "buy_now", "remove_from_cart")
- `productId` (string|number) - Shopify product ID
- `productTitle` (string, max 500 chars) - Product title
- `productUrl` (string) - Product URL (must be valid URL format if provided)
- `variantId` (string|number) - Shopify product variant ID
- `customerId` (string|number) - Shopify customer ID

**Auto-captured Fields (not in request body):**
- `userAgent` - Automatically captured from request headers
- `ipAddress` - Automatically captured from request

#### Request Example
```json
{
  "storeName": "example.myshopify.com",
  "actionType": "add_to_cart",
  "productId": "123456789",
  "productTitle": "Blue Denim Jacket",
  "productUrl": "https://example.myshopify.com/products/blue-denim-jacket",
  "variantId": "987654321",
  "customerId": "456789012"
}
```

#### Response

**Success Response (200 OK)**
```json
{
  "status": "success",
  "message": "Cart event tracked successfully",
  "data": {
    "id": "cart-event-1735689600000-abc123xyz",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

**Error Responses**

**400 Bad Request - Validation Error**
```json
{
  "status": "error",
  "error": "Validation Error",
  "message": {
    "code": "VALIDATION_ERROR",
    "field": "storeName",
    "reason": "Field is required and must be a non-empty string"
  }
}
```

**503 Service Unavailable - Database Unavailable**
```json
{
  "status": "error",
  "error": "Database service unavailable",
  "message": {
    "code": "DATABASE_UNAVAILABLE",
    "service": "database"
  }
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "error": "Server Error",
  "message": {
    "code": "DATABASE_ERROR",
    "message": "Failed to track cart event",
    "originalError": "Database connection failed"
  }
}
```

#### Validation Rules
- `storeName` - Required, must be valid Shopify domain format (will be normalized)
- `productUrl` - If provided, must be valid URL format
- All string fields are sanitized and truncated to their max lengths
- `productId`, `variantId`, and `customerId` can be numbers or strings (converted to strings)

---

### 2. Get All Cart Tracking Events
**Retrieve cart tracking events with filters**

#### Endpoint
```
GET /api/cart-tracking/all
```

#### Purpose
Retrieves all cart tracking events with various filtering, pagination, and sorting options.

#### Headers
```
Content-Type: application/json
```

#### Query Parameters

**Pagination:**
- `page` (number, optional, default: 1) - Page number (must be positive integer)
- `limit` (number, optional, default: 50, max: 100) - Items per page (between 1 and 100)

**Filters:**
- `storeName` (string, optional) - Filter by store name (will be normalized)
- `customerId` (string, optional) - Filter by customer ID
- `actionType` (string, optional) - Filter by action type (e.g., "add_to_cart", "buy_now", "remove_from_cart")
- `productId` (string, optional) - Filter by product ID
- `variantId` (string, optional) - Filter by variant ID
- `startDate` (string, optional) - Start date filter (format: YYYY-MM-DD, inclusive)
- `endDate` (string, optional) - End date filter (format: YYYY-MM-DD, inclusive)

**Sorting:**
- `orderBy` (string, optional, default: "created_at") - Order by field
  - Allowed values: `created_at`, `updated_at`, `action_type`, `product_id`, `variant_id`
  - Maps to: `createdAt`, `updatedAt`, `actionType`, `productId`, `variantId`
- `orderDirection` (string, optional, default: "DESC") - Order direction
  - Allowed values: `ASC`, `DESC`

#### Request Example
```
GET /api/cart-tracking/all?page=1&limit=50&storeName=example.myshopify.com&actionType=add_to_cart&startDate=2025-01-01&endDate=2025-01-31&orderBy=created_at&orderDirection=DESC
```

#### Response

**Success Response (200 OK)**
```json
{
  "status": "success",
  "message": "Cart events retrieved successfully",
  "data": {
    "records": [
      {
        "id": "cart-event-1735689600000-abc123xyz",
        "storeName": "example.myshopify.com",
        "actionType": "add_to_cart",
        "productId": "123456789",
        "productTitle": "Blue Denim Jacket",
        "productUrl": "https://example.myshopify.com/products/blue-denim-jacket",
        "variantId": "987654321",
        "customerId": "456789012",
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.1",
        "createdAt": "2025-01-01T12:00:00.000Z",
        "updatedAt": "2025-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "eventsCount": 150,
      "customersCount": 45,
      "productsCount": 23,
      "storesCount": 5,
      "actionTypeBreakdown": {
        "add_to_cart": 120,
        "buy_now": 25,
        "remove_from_cart": 5
      }
    }
  }
}
```

**Error Responses**

**400 Bad Request - Validation Error**
```json
{
  "status": "error",
  "error": "Validation Error",
  "message": {
    "code": "VALIDATION_ERROR",
    "field": "page",
    "reason": "Page must be a positive integer"
  }
}
```

**503 Service Unavailable - Database Unavailable**
```json
{
  "status": "error",
  "error": "Database service unavailable",
  "message": {
    "code": "DATABASE_UNAVAILABLE",
    "service": "database"
  }
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "error": "Server Error",
  "message": {
    "code": "DATABASE_ERROR",
    "message": "Failed to retrieve cart events",
    "originalError": "Database connection failed"
  }
}
```

#### Response Fields

**Record Fields:**
- `id` (string) - Unique event identifier
- `storeName` (string) - Store name (normalized)
- `actionType` (string|null) - Type of cart action
- `productId` (string|null) - Product ID
- `productTitle` (string|null) - Product title
- `productUrl` (string|null) - Product URL
- `variantId` (string|null) - Variant ID
- `customerId` (string|null) - Customer ID
- `userAgent` (string|null) - User agent string
- `ipAddress` (string|null) - IP address
- `createdAt` (string) - Creation timestamp (ISO 8601)
- `updatedAt` (string) - Last update timestamp (ISO 8601)

**Pagination Fields:**
- `total` (number) - Total number of records matching filters
- `page` (number) - Current page number
- `limit` (number) - Items per page
- `totalPages` (number) - Total number of pages
- `hasNext` (boolean) - Whether there is a next page
- `hasPrev` (boolean) - Whether there is a previous page

**Summary Fields:**
- `eventsCount` (number) - Total events matching filters
- `customersCount` (number) - Distinct customers count
- `productsCount` (number) - Distinct products count
- `storesCount` (number) - Distinct stores count
- `actionTypeBreakdown` (object) - Count of events by action type

---

### 3. Get Cart Events by Customer and Store
**Retrieve cart tracking events for a specific customer from a specific store**

#### Endpoint
```
GET /api/cart-tracking/customer/:customerId/store/:storeName
```

#### Purpose
Retrieves cart tracking events for a particular customer from a particular store with optional filters.

#### Headers
```
Content-Type: application/json
```

#### URL Parameters
- `customerId` (string, required) - Customer ID
- `storeName` (string, required) - Store name (will be normalized)

#### Query Parameters

**Pagination:**
- `page` (number, optional, default: 1) - Page number (must be positive integer)
- `limit` (number, optional, default: 50, max: 100) - Items per page (between 1 and 100)

**Filters:**
- `actionType` (string, optional) - Filter by action type
- `productId` (string, optional) - Filter by product ID
- `variantId` (string, optional) - Filter by variant ID
- `startDate` (string, optional) - Start date filter (format: YYYY-MM-DD, inclusive)
- `endDate` (string, optional) - End date filter (format: YYYY-MM-DD, inclusive)

**Sorting:**
- `orderBy` (string, optional, default: "created_at") - Order by field
  - Allowed values: `created_at`, `updated_at`, `action_type`, `product_id`, `variant_id`
- `orderDirection` (string, optional, default: "DESC") - Order direction
  - Allowed values: `ASC`, `DESC`

#### Request Example
```
GET /api/cart-tracking/customer/456789012/store/example.myshopify.com?page=1&limit=50&actionType=add_to_cart&startDate=2025-01-01&endDate=2025-01-31&orderBy=created_at&orderDirection=DESC
```

#### Response

**Success Response (200 OK)**
```json
{
  "status": "success",
  "message": "Cart events retrieved successfully",
  "data": {
    "records": [
      {
        "id": "cart-event-1735689600000-abc123xyz",
        "storeName": "example.myshopify.com",
        "actionType": "add_to_cart",
        "productId": "123456789",
        "productTitle": "Blue Denim Jacket",
        "productUrl": "https://example.myshopify.com/products/blue-denim-jacket",
        "variantId": "987654321",
        "customerId": "456789012",
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.1",
        "createdAt": "2025-01-01T12:00:00.000Z",
        "updatedAt": "2025-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "summary": {
      "customerId": "456789012",
      "storeName": "example.myshopify.com",
      "eventsCount": 25
    }
  }
}
```

**Error Responses**

**400 Bad Request - Validation Error**
```json
{
  "status": "error",
  "error": "Validation Error",
  "message": {
    "code": "VALIDATION_ERROR",
    "field": "customerId",
    "reason": "Customer ID is required"
  }
}
```

**503 Service Unavailable - Database Unavailable**
```json
{
  "status": "error",
  "error": "Database service unavailable",
  "message": {
    "code": "DATABASE_UNAVAILABLE",
    "service": "database"
  }
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "error": "Server Error",
  "message": {
    "code": "DATABASE_ERROR",
    "message": "Failed to retrieve cart events",
    "originalError": "Database connection failed"
  }
}
```

#### Response Fields

**Record Fields:** Same as "Get All Cart Tracking Events" endpoint

**Pagination Fields:** Same as "Get All Cart Tracking Events" endpoint

**Summary Fields:**
- `customerId` (string) - Customer ID
- `storeName` (string) - Store name
- `eventsCount` (number) - Total events for this customer/store combination

---

## Common Features

### Store Name Normalization
- Store names are automatically normalized to `{store}.myshopify.com` format
- Invalid store name formats will return a 400 validation error

### Date Filtering
- Dates are inclusive (includes entire day)
- Format: `YYYY-MM-DD` (e.g., `2025-01-15`)
- `startDate` includes from 00:00:00 of that day
- `endDate` includes until 23:59:59.999 of that day

### Pagination
- Default page size: 50 items
- Maximum page size: 100 items
- Page numbers start at 1
- Pagination info includes `hasNext` and `hasPrev` flags for easy navigation

### Sorting
- Default: `created_at DESC` (newest first)
- Allowed fields: `created_at`, `updated_at`, `action_type`, `product_id`, `variant_id`
- Direction: `ASC` (ascending) or `DESC` (descending)

### Filtering Logic
- All filters use AND logic (all conditions must match)
- Multiple filters can be combined
- Empty/null values are ignored (not applied as filters)

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed (missing/invalid fields) |
| `DATABASE_UNAVAILABLE` | Database service is not available |
| `DATABASE_ERROR` | Database operation failed |
| `SERVER_ERROR` | Generic server error |

---

## Rate Limiting
Currently, no rate limiting is implemented. Consider implementing:
- Per-IP rate limits
- Per-customer rate limits (if authenticated)
- Per-store rate limits

---

## Authentication
Currently, no authentication is required. Consider adding:
- API key authentication for production use
- Store-level authentication
- Admin-only access for GET endpoints

---

## Examples

### Example 1: Track a Cart Event
```bash
curl -X POST https://api.example.com/api/cart-tracking/track \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "example.myshopify.com",
    "actionType": "add_to_cart",
    "productId": "123456789",
    "productTitle": "Blue Denim Jacket",
    "productUrl": "https://example.myshopify.com/products/blue-denim-jacket",
    "variantId": "987654321",
    "customerId": "456789012"
  }'
```

### Example 2: Get All Events for a Store
```bash
curl "https://api.example.com/api/cart-tracking/all?storeName=example.myshopify.com&page=1&limit=50"
```

### Example 3: Get Events by Customer and Store
```bash
curl "https://api.example.com/api/cart-tracking/customer/456789012/store/example.myshopify.com?page=1&limit=50&actionType=add_to_cart"
```

### Example 4: Get Events with Date Range
```bash
curl "https://api.example.com/api/cart-tracking/all?storeName=example.myshopify.com&startDate=2025-01-01&endDate=2025-01-31&page=1&limit=50"
```

### Example 5: Get Events by Action Type
```bash
curl "https://api.example.com/api/cart-tracking/all?actionType=buy_now&page=1&limit=50"
```

---

## Notes

1. **Store Name Format**: Store names are normalized to `.myshopify.com` format. Both `example.myshopify.com` and `example` will be normalized to `example.myshopify.com`.

2. **Customer ID Format**: Customer IDs can be provided as strings or numbers. They are stored as strings in the database.

3. **Product/Variant IDs**: Product and variant IDs can be provided as strings or numbers. They are stored as strings in the database.

4. **Action Types**: Common action types include:
   - `add_to_cart` - Product added to cart
   - `buy_now` - Buy now action
   - `remove_from_cart` - Product removed from cart
   - Custom action types can be used (max 100 characters)

5. **Data Retention**: Consider implementing data retention policies for cart tracking events.

6. **Privacy**: IP addresses and user agents are automatically captured. Ensure compliance with GDPR/CCPA regulations.

---

## Version History

- **v1.0.0** (2025-01-XX)
  - Initial API release
  - POST endpoint for tracking cart events
  - GET endpoints for retrieving cart events with filters

