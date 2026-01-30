# Order APIs Specifications

This document contains complete specifications for all Order APIs (excluding the Get Store Orders API).

---

## Table of Contents

1. [Get Customer Orders](#1-get-customer-orders)
2. [Get Orders from Database](#2-get-orders-from-database)
3. [Sync Orders](#3-sync-orders)
4. [Batch Sync Orders](#4-batch-sync-orders)

---

## 1. Get Customer Orders

### Overview
Retrieves all orders for a specific customer from a Shopify store using the Shopify Admin API.

### Endpoint
```
GET /api/stores/:shopDomain/customers/:customerId/orders
```

### Authentication
- **Type:** Optional Authentication
- **Required:** No (but recommended for store access)
- **Authorization:** Optional Store Admin or Admin access

### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `shopDomain` | string | Yes | Shopify store domain (must be valid .myshopify.com domain) | `myshop.myshopify.com` |
| `customerId` | string | Yes | Shopify GraphQL Customer ID (GID format) | `gid://shopify/Customer/123456789` |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 50 | Number of records per page (min: 1, max: 250) |
| `after` | string | No | null | Cursor for pagination (from previous response) |
| `status` | string | No | null | Filter by order status |
| `financialStatus` | string | No | null | Filter by financial status (e.g., `paid`, `pending`, `refunded`) |
| `fulfillmentStatus` | string | No | null | Filter by fulfillment status (e.g., `fulfilled`, `unfulfilled`, `partial`) |
| `startDate` | string | No | null | Filter by order creation date start (format: `YYYY-MM-DD`) |
| `endDate` | string | No | null | Filter by order creation date end (format: `YYYY-MM-DD`) |
| `sortKey` | string | No | `CREATED_AT` | Sort key (options: `CREATED_AT`, `UPDATED_AT`, `PROCESSED_AT`, `TOTAL_PRICE`) |
| `reverse` | boolean | No | true | Reverse sort order (`true` = newest first, `false` = oldest first) |

### Request Example

```
GET /api/stores/myshop.myshopify.com/customers/gid://shopify/Customer/123456789/orders?limit=50&financialStatus=paid&sortKey=CREATED_AT&reverse=true
```

### Response Format

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "gid://shopify/Customer/123456789",
      "displayName": "John Doe",
      "email": "john@example.com"
    },
    "orders": [
      {
        "id": "gid://shopify/Order/987654321",
        "name": "#1001",
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-15T10:05:00Z",
        "displayFinancialStatus": "PAID",
        "displayFulfillmentStatus": "FULFILLED",
        "cancelReason": null,
        "cancelledAt": null,
        "closed": false,
        "closedAt": null,
        "confirmed": true,
        "test": false,
        "totalPriceSet": {
          "shopMoney": {
            "amount": "99.99",
            "currencyCode": "USD"
          }
        },
        "subtotalPriceSet": {
          "shopMoney": {
            "amount": "89.99",
            "currencyCode": "USD"
          }
        },
        "totalTaxSet": {
          "shopMoney": {
            "amount": "10.00",
            "currencyCode": "USD"
          }
        },
        "totalShippingPriceSet": {
          "shopMoney": {
            "amount": "5.00",
            "currencyCode": "USD"
          }
        },
        "totalDiscountsSet": {
          "shopMoney": {
            "amount": "0.00",
            "currencyCode": "USD"
          }
        },
        "lineItems": {
          "edges": [
            {
              "node": {
                "id": "gid://shopify/LineItem/111",
                "name": "Product Name",
                "quantity": 2,
                "originalUnitPriceSet": {
                  "shopMoney": {
                    "amount": "44.99",
                    "currencyCode": "USD"
                  }
                },
                "discountedUnitPriceSet": {
                  "shopMoney": {
                    "amount": "44.99",
                    "currencyCode": "USD"
                  }
                },
                "variant": {
                  "id": "gid://shopify/ProductVariant/222",
                  "title": "Size M",
                  "sku": "PROD-001-M",
                  "barcode": "1234567890123",
                  "price": "44.99",
                  "product": {
                    "id": "gid://shopify/Product/333",
                    "title": "Product Name",
                    "handle": "product-name"
                  }
                },
                "product": {
                  "id": "gid://shopify/Product/333",
                  "title": "Product Name",
                  "handle": "product-name"
                }
              }
            }
          ]
        },
        "discountApplications": {
          "edges": []
        },
        "fulfillments": [
          {
            "id": "gid://shopify/Fulfillment/444",
            "status": "SUCCESS",
            "trackingInfo": [
              {
                "number": "TRACK123456",
                "url": "https://tracking.example.com/TRACK123456",
                "company": "Shipping Co"
              }
            ],
            "createdAt": "2025-01-15T11:00:00Z",
            "updatedAt": "2025-01-15T11:00:00Z"
          }
        ],
        "transactions": [
          {
            "id": "gid://shopify/Transaction/555",
            "kind": "SALE",
            "status": "SUCCESS",
            "amount": "99.99",
            "processedAt": "2025-01-15T10:00:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "hasNextPage": false,
      "hasPreviousPage": false,
      "startCursor": "eyJsYXN0X2lkIjo...",
      "endCursor": "eyJsYXN0X2lkIjo..."
    }
  },
  "requestId": "req_1234567890_abc123"
}
```

#### Error Responses

**400 Bad Request** - Invalid parameters
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid customer ID format",
  "requestId": "req_1234567890_abc123"
}
```

**403 Forbidden** - Access denied
```json
{
  "success": false,
  "error": "Access Denied",
  "message": "You do not have permission to access this store",
  "requestId": "req_1234567890_abc123"
}
```

**404 Not Found** - Customer not found
```json
{
  "success": false,
  "error": "Customer Not Found",
  "message": "Customer with ID gid://shopify/Customer/123456789 not found",
  "requestId": "req_1234567890_abc123"
}
```

**503 Service Unavailable** - Database unavailable
```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "Database service unavailable",
  "details": {
    "service": "database"
  }
}
```

### Notes
- Uses Shopify GraphQL Admin API
- Requires Protected Customer Data approval for customer order access
- Supports cursor-based pagination
- Maximum 250 orders per request
- Customer ID must be in Shopify GID format

---

## 2. Get Orders from Database

### Overview
Retrieves orders from the local database (synced from Shopify). This API is faster than querying Shopify directly and avoids rate limits.

### Endpoint
```
GET /api/admin/orders
```

### Authentication
- **Type:** Bearer Token
- **Required:** Yes
- **Authorization:** Admin Only

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `shop` | string | No | null | Filter by shop domain (e.g., `myshop.myshopify.com`) |
| `financialStatus` | string | No | null | Filter by financial status (e.g., `paid`, `pending`, `refunded`) |
| `fulfillmentStatus` | string | No | null | Filter by fulfillment status (e.g., `fulfilled`, `unfulfilled`) |
| `orderStatus` | string | No | null | Filter by order status |
| `cancelled` | boolean | No | null | Filter cancelled orders (`true`/`false`) |
| `closed` | boolean | No | null | Filter closed orders (`true`/`false`) |
| `confirmed` | boolean | No | null | Filter confirmed orders (`true`/`false`) |
| `test` | boolean | No | null | Filter test orders (`true`/`false`) |
| `customerId` | string | No | null | Filter by customer ID (Shopify GID format) |
| `search` | string | No | null | Search in order name (partial match, case-insensitive) |
| `start_date` | string | No | null | Filter orders from this date (format: `YYYY-MM-DD` or ISO 8601) |
| `end_date` | string | No | null | Filter orders until this date (format: `YYYY-MM-DD` or ISO 8601) |
| `dateField` | string | No | `created_at` | Date field to filter by. Options: `created_at`, `updated_at`, `last_synced_at`, `shopify_created_at`, `shopify_updated_at` |
| `minTotal` | number | No | null | Minimum order total amount |
| `maxTotal` | number | No | null | Maximum order total amount |
| `page` | integer | No | 1 | Page number (min: 1) |
| `limit` | integer | No | 50 | Records per page (min: 1, max: 100) |
| `orderBy` | string | No | `created_at` | Order by field. Options: `created_at`, `updated_at`, `last_synced_at`, `order_name`, `order_number`, `financial_status`, `fulfillment_status`, `shopify_created_at`, `shopify_updated_at` |
| `orderDirection` | string | No | `DESC` | Sort direction (`ASC` or `DESC`) |

### Request Example

```
GET /api/admin/orders?shop=myshop.myshopify.com&financialStatus=paid&page=1&limit=50&orderBy=created_at&orderDirection=DESC
```

### Response Format

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shopDomain": "myshop.myshopify.com",
      "shopifyOrderId": "gid://shopify/Order/987654321",
      "orderName": "#1001",
      "orderNumber": 1001,
      "financialStatus": "paid",
      "fulfillmentStatus": "fulfilled",
      "orderStatus": "fulfilled",
      "cancelled": false,
      "cancelReason": null,
      "cancelledAt": null,
      "closed": false,
      "closedAt": null,
      "confirmed": true,
      "test": false,
      "totals": {
        "total": {
          "amount": 99.99,
          "currencyCode": "USD"
        },
        "subtotal": {
          "amount": 89.99,
          "currencyCode": "USD"
        },
        "tax": {
          "amount": 10.00,
          "currencyCode": "USD"
        },
        "shipping": {
          "amount": 5.00,
          "currencyCode": "USD"
        },
        "discounts": {
          "amount": 0.00,
          "currencyCode": "USD"
        }
      },
      "lineItems": [
        {
          "id": "gid://shopify/LineItem/111",
          "name": "Product Name",
          "quantity": 2,
          "originalUnitPrice": {
            "amount": 44.99,
            "currencyCode": "USD"
          },
          "discountedUnitPrice": {
            "amount": 44.99,
            "currencyCode": "USD"
          },
          "originalTotal": {
            "amount": 89.98,
            "currencyCode": "USD"
          },
          "discountedTotal": {
            "amount": 89.98,
            "currencyCode": "USD"
          },
          "variant": {
            "id": "gid://shopify/ProductVariant/222",
            "title": "Size M",
            "sku": "PROD-001-M",
            "barcode": "1234567890123",
            "price": "44.99",
            "product": {
              "id": "gid://shopify/Product/333",
              "title": "Product Name",
              "handle": "product-name"
            }
          },
          "product": {
            "id": "gid://shopify/Product/333",
            "title": "Product Name",
            "handle": "product-name"
          }
        }
      ],
      "discountApplications": [],
      "fulfillments": [
        {
          "id": "gid://shopify/Fulfillment/444",
          "status": "SUCCESS",
          "trackingInfo": [
            {
              "number": "TRACK123456",
              "url": "https://tracking.example.com/TRACK123456",
              "company": "Shipping Co"
            }
          ],
          "createdAt": "2025-01-15T11:00:00Z",
          "updatedAt": "2025-01-15T11:00:00Z"
        }
      ],
      "transactions": [
        {
          "id": "gid://shopify/Transaction/555",
          "kind": "SALE",
          "status": "SUCCESS",
          "amount": 99.99,
          "currencyCode": "USD",
          "processedAt": "2025-01-15T10:00:00Z"
        }
      ],
      "customerId": "gid://shopify/Customer/123456789",
      "shopifyCreatedAt": "2025-01-15T10:00:00Z",
      "shopifyUpdatedAt": "2025-01-15T10:05:00Z",
      "lastSyncedAt": "2025-01-15T12:00:00Z",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3,
    "hasMore": true
  },
  "filters": {
    "shop": "myshop.myshopify.com",
    "financialStatus": "paid",
    "fulfillmentStatus": null,
    "orderStatus": null,
    "cancelled": null,
    "closed": null,
    "confirmed": null,
    "test": null,
    "customerId": null,
    "search": null,
    "start_date": null,
    "end_date": null,
    "dateField": "created_at",
    "minTotal": null,
    "maxTotal": null
  },
  "requestId": "req_1234567890_abc123"
}
```

#### Error Responses

**400 Bad Request** - Invalid parameters
```json
{
  "success": false,
  "error": "Invalid page parameter",
  "message": "Page must be a positive integer",
  "requestId": "req_1234567890_abc123"
}
```

**401 Unauthorized** - Missing or invalid token
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication token required"
}
```

**403 Forbidden** - Not admin
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**500 Internal Server Error** - Server error
```json
{
  "success": false,
  "error": "Failed to get orders",
  "message": "An unexpected error occurred",
  "requestId": "req_1234567890_abc123"
}
```

### Notes
- Queries local database (not Shopify API)
- Faster response times
- No Shopify rate limits
- Supports advanced filtering and search
- Uses page-based pagination (not cursor-based)
- Orders must be synced first using Sync Orders API

---

## 3. Sync Orders

### Overview
Syncs orders from a Shopify store to the local database. Supports both full sync (all orders) and incremental sync (orders updated since last sync).

### Endpoint
```
POST /api/admin/orders/sync
```

### Authentication
- **Type:** Bearer Token
- **Required:** Yes
- **Authorization:** Admin Only

### Request Body

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `shop` | string | Yes | - | Shopify store domain (e.g., `myshop.myshopify.com`) |
| `fullSync` | boolean | No | `false` | If `true`, forces full sync of all orders. If `false`, auto-detects sync type |
| `autoDetectSyncType` | boolean | No | `true` | If `true`, automatically determines sync type. If `false`, uses incremental sync |

### Sync Type Logic

**When `fullSync=false` and `autoDetectSyncType=true` (default):**
- **Full Sync:** Performed if no previous sync data exists (first time sync)
- **Incremental Sync:** Performed if previous sync data exists (syncs orders updated since `last_synced_at`)

**When `fullSync=true`:**
- Always performs full sync regardless of previous sync data

**When `fullSync=false` and `autoDetectSyncType=false`:**
- Always performs incremental sync (requires previous sync data)

### Request Example

```json
{
  "shop": "myshop.myshopify.com",
  "fullSync": false,
  "autoDetectSyncType": true
}
```

### Response Format

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Orders synced successfully for myshop.myshopify.com",
  "data": {
    "success": true,
    "shopDomain": "myshop.myshopify.com",
    "totalOrders": 150,
    "created": 50,
    "updated": 100,
    "errors": 0,
    "syncType": "incremental",
    "syncReason": "Incremental sync - fetching orders updated since 2025-01-10T10:00:00Z (5 days ago)",
    "requestId": "sync_1234567890_abc123"
  },
  "requestId": "req_1234567890_abc123"
}
```

#### Error Responses

**400 Bad Request** - Missing or invalid shop parameter
```json
{
  "success": false,
  "error": "Missing shop parameter",
  "message": "Shop domain is required in request body",
  "requestId": "req_1234567890_abc123"
}
```

**400 Bad Request** - Invalid shop domain
```json
{
  "success": false,
  "error": "Invalid shop domain",
  "message": "Provide a valid .myshopify.com domain",
  "requestId": "req_1234567890_abc123"
}
```

**401 Unauthorized** - Missing or invalid token
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication token required"
}
```

**403 Forbidden** - Not admin
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**500 Internal Server Error** - Sync failed
```json
{
  "success": false,
  "error": "Failed to sync orders",
  "message": "Access token not found for shop: myshop.myshopify.com",
  "requestId": "req_1234567890_abc123"
}
```

### Sync Result Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether sync completed successfully |
| `shopDomain` | string | Normalized shop domain |
| `totalOrders` | integer | Total number of orders fetched from Shopify |
| `created` | integer | Number of new orders created in database |
| `updated` | integer | Number of existing orders updated in database |
| `errors` | integer | Number of orders that failed to sync |
| `syncType` | string | Type of sync performed (`full` or `incremental`) |
| `syncReason` | string | Explanation of why this sync type was chosen |
| `requestId` | string | Unique request identifier for tracking |

### Notes
- Uses Shopify GraphQL Admin API
- Processes orders in batches of 100 for optimal performance
- Uses database transactions for atomicity (all or nothing)
- Updates `last_synced_at` timestamp for each order
- Incremental sync fetches orders updated since last sync date
- Works efficiently even if last sync was weeks or months ago
- Maximum 250 orders per Shopify API request

---

## 4. Batch Sync Orders

### Overview
Syncs orders from multiple Shopify stores to the local database in a single request. Processes stores sequentially to avoid overwhelming the system.

### Endpoint
```
POST /api/admin/orders/batch-sync
```

### Authentication
- **Type:** Bearer Token
- **Required:** Yes
- **Authorization:** Admin Only

### Request Body

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `shops` | array[string] | Yes | - | Array of Shopify store domains (e.g., `["store1.myshopify.com", "store2.myshopify.com"]`) |
| `fullSync` | boolean | No | `false` | If `true`, syncs all orders regardless of last sync time. If `false`, uses incremental sync |

### Request Example

```json
{
  "shops": [
    "store1.myshopify.com",
    "store2.myshopify.com",
    "store3.myshopify.com"
  ],
  "fullSync": false
}
```

### Response Format

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "All 3 stores synced successfully",
  "data": {
    "success": true,
    "batchRequestId": "batch_1234567890_abc123",
    "totalStores": 3,
    "successful": 3,
    "failed": 0,
    "summary": {
      "totalOrders": 450,
      "totalCreated": 150,
      "totalUpdated": 300,
      "totalErrors": 0
    },
    "results": [
      {
        "shopDomain": "store1.myshopify.com",
        "success": true,
        "totalOrders": 150,
        "created": 50,
        "updated": 100,
        "errors": 0,
        "syncType": "incremental",
        "syncReason": "Incremental sync - fetching orders updated since 2025-01-10T10:00:00Z",
        "requestId": "sync_1111111111_xyz111"
      },
      {
        "shopDomain": "store2.myshopify.com",
        "success": true,
        "totalOrders": 200,
        "created": 75,
        "updated": 125,
        "errors": 0,
        "syncType": "incremental",
        "syncReason": "Incremental sync - fetching orders updated since 2025-01-10T10:00:00Z",
        "requestId": "sync_2222222222_xyz222"
      },
      {
        "shopDomain": "store3.myshopify.com",
        "success": true,
        "totalOrders": 100,
        "created": 25,
        "updated": 75,
        "errors": 0,
        "syncType": "incremental",
        "syncReason": "Incremental sync - fetching orders updated since 2025-01-10T10:00:00Z",
        "requestId": "sync_3333333333_xyz333"
      }
    ]
  },
  "requestId": "req_1234567890_abc123"
}
```

#### Partial Success Response (200 OK)

When some stores fail:

```json
{
  "success": true,
  "message": "2 of 3 stores synced successfully",
  "data": {
    "success": true,
    "batchRequestId": "batch_1234567890_abc123",
    "totalStores": 3,
    "successful": 2,
    "failed": 1,
    "summary": {
      "totalOrders": 350,
      "totalCreated": 125,
      "totalUpdated": 225,
      "totalErrors": 0
    },
    "results": [
      {
        "shopDomain": "store1.myshopify.com",
        "success": true,
        "totalOrders": 150,
        "created": 50,
        "updated": 100,
        "errors": 0,
        "syncType": "incremental",
        "syncReason": "Incremental sync - fetching orders updated since 2025-01-10T10:00:00Z",
        "requestId": "sync_1111111111_xyz111"
      },
      {
        "shopDomain": "store2.myshopify.com",
        "success": false,
        "error": "Access token not found for shop: store2.myshopify.com",
        "errorDetails": "Error: Access token not found..."
      },
      {
        "shopDomain": "store3.myshopify.com",
        "success": true,
        "totalOrders": 200,
        "created": 75,
        "updated": 125,
        "errors": 0,
        "syncType": "incremental",
        "syncReason": "Incremental sync - fetching orders updated since 2025-01-10T10:00:00Z",
        "requestId": "sync_3333333333_xyz333"
      }
    ]
  },
  "requestId": "req_1234567890_abc123"
}
```

#### Error Responses

**400 Bad Request** - Missing or invalid shops parameter
```json
{
  "success": false,
  "error": "Missing or invalid shops parameter",
  "message": "shops must be a non-empty array of shop domains",
  "requestId": "req_1234567890_abc123"
}
```

**400 Bad Request** - No valid shop domains
```json
{
  "success": false,
  "error": "No valid shop domains",
  "message": "All provided shop domains are invalid. Provide valid .myshopify.com domains",
  "requestId": "req_1234567890_abc123"
}
```

**401 Unauthorized** - Missing or invalid token
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication token required"
}
```

**403 Forbidden** - Not admin
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**500 Internal Server Error** - Batch sync failed
```json
{
  "success": false,
  "error": "Failed to batch sync orders",
  "message": "An unexpected error occurred",
  "requestId": "req_1234567890_abc123"
}
```

### Batch Result Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether batch sync completed (may be true even if some stores failed) |
| `batchRequestId` | string | Unique batch request identifier |
| `totalStores` | integer | Total number of stores in batch |
| `successful` | integer | Number of stores synced successfully |
| `failed` | integer | Number of stores that failed to sync |
| `summary` | object | Aggregated statistics across all stores |
| `summary.totalOrders` | integer | Total orders fetched across all stores |
| `summary.totalCreated` | integer | Total new orders created across all stores |
| `summary.totalUpdated` | integer | Total orders updated across all stores |
| `summary.totalErrors` | integer | Total errors across all stores |
| `results` | array | Array of sync results for each store |

### Notes
- Processes stores sequentially (one at a time)
- Includes 500ms delay between stores to avoid rate limiting
- Continues processing even if some stores fail
- Each store sync uses the same logic as single Sync Orders API
- Invalid shop domains are filtered out automatically
- Returns partial success if some stores succeed and others fail
- Uses incremental sync by default (unless `fullSync=true`)

---

## Common Response Fields

### Pagination Object

```json
{
  "total": 150,
  "page": 1,
  "limit": 50,
  "totalPages": 3,
  "hasMore": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | Total number of records matching the query |
| `page` | integer | Current page number |
| `limit` | integer | Number of records per page |
| `totalPages` | integer | Total number of pages |
| `hasMore` | boolean | Whether there are more pages available |

### Request ID

All responses include a `requestId` field for tracking and debugging purposes. Format: `req_[timestamp]_[random_string]`

---

## Error Codes

| Code | Description |
|------|-------------|
| `400` | Bad Request - Invalid parameters or missing required fields |
| `401` | Unauthorized - Missing or invalid authentication token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server-side error |
| `503` | Service Unavailable - Database or external service unavailable |

---

## Rate Limits

- **Shopify API:** Subject to Shopify's rate limits (typically 40 requests per app per store per minute)
- **Database API:** No rate limits (queries local database)
- **Batch Sync:** Includes 500ms delay between stores to avoid overwhelming Shopify API

---

## Best Practices

1. **Use Database API** (`GET /api/admin/orders`) for frequent queries to avoid Shopify rate limits
2. **Sync Regularly** - Run incremental syncs periodically to keep data up-to-date
3. **Use Filters** - Apply filters in database queries for better performance
4. **Monitor Sync Results** - Check `errors` count in sync responses
5. **Handle Pagination** - Use pagination for large result sets
6. **Error Handling** - Always check `success` field in responses and handle errors appropriately

---

## Version History

- **v1.0** - Initial release with all 4 order APIs

---

**Last Updated:** January 2025

