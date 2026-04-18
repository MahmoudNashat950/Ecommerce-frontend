# Backend API Alignment Requirements for Frontend

## Summary of Frontend Implementation

The frontend has been updated to align with the backend API design. This document outlines what the backend **must** provide to support the current frontend implementation.

---

## 1. **Critical Endpoints Required**

### User & Authentication
✅ **POST /api/Auth/login** - Login with email/password
- Expected: Returns JWT token
- Token claims should include: `sub`, `nameid`, `id`, or `userId` for user ID
- Token should include `role` claim for role-based access

✅ **POST /api/Auth/register** - Register with name, email, password, role
- Expected: Registration success response

### Order Management (Buyer & Seller)

✅ **GET /api/Order/my** - Get buyer's orders
- Required: Authorization header `Bearer <token>`
- Required role: `Buyer`
- Expected response: Array of OrderResponseDto

✅ **GET /api/Order/seller** - Get seller's orders
- Required: Authorization header `Bearer <token>`
- Required role: `Seller`
- Expected response: Array of OrderResponseDto

✅ **PUT /api/Order/{id}/status** - Update order status
- Required: Authorization header `Bearer <token>`
- Required role: `Seller` AND seller must own product in order
- Request body: `{ "status": "Pending|Processing|Shipped|Delivered" }`
- Expected: Success response or 403 if unauthorized

✅ **POST /api/Order/{orderId}/comments** - Add comment to order
- Required: Authorization header `Bearer <token>`
- Required role: `Buyer` (commenter must be order buyer)
- Request body: `{ "text": "comment text" }`
- Expected: Success response

**🔴 MISSING - Backend Must Implement:**

**GET /api/Order/{orderId}/comments** - Get comments for an order
- Required: Authorization header `Bearer <token>`
- Expected response: Array of comment objects with structure:
  ```json
  [
    {
      "id": 1,
      "orderId": 123,
      "userId": 456,
      "text": "Please deliver after 5 PM",
      "createdAt": "2026-04-14T10:30:00Z"
    }
  ]
  ```
- Return empty array if no comments
- Status: 200 OK

### Reviews & Ratings

✅ **POST /api/Review** - Create/update product review
- Required: Authorization header `Bearer <token>`
- Required role: `Buyer`
- Request body:
  ```json
  {
    "productId": 77,
    "rating": 5,
    "comment": "Great product!"
  }
  ```
- Expected: Upsert behavior (update if exists, create if doesn't)
- Backend must validate: rating 1-5 only

✅ **GET /api/Review/product/{productId}** - Get all reviews for product
- Expected response: Array of review objects with:
  ```json
  [
    {
      "id": 1,
      "productId": 77,
      "userId": 123,
      "rating": 5,
      "comment": "Excellent!",
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ]
  ```

✅ **GET /api/Review/summary/{productId}** - Get review summary
- Expected response:
  ```json
  {
    "productId": 77,
    "totalReviews": 10,
    "averageRating": 4.5
  }
  ```

### Flagging

✅ **POST /api/Flag/seller** - Flag a seller
- Required: Authorization header `Bearer <token>`
- Required role: `Buyer`
- Request body: `{ "sellerId": 45, "reason": "Spam" }`
- Expected: Success response, handle duplicate flags gracefully (return "Already flagged" message)

✅ **POST /api/Flag/buyer** - Flag a buyer
- Required: Authorization header `Bearer <token>`
- Required role: `Seller`
- Request body: `{ "buyerId": 22, "reason": "Fraud" }`
- Expected: Success response, handle duplicate flags gracefully

---

## 2. **OrderResponseDto Structure**

All endpoints returning orders must use this exact structure:

```json
{
  "id": 123,
  "buyerId": 456,
  "buyerName": "John Doe",
  "status": "Processing",
  "createdAt": "2026-04-14T10:00:00Z",
  "totalPrice": 149.99,
  "items": [
    {
      "id": 1,
      "productName": "Laptop",
      "quantity": 1,
      "price": 999.99
    },
    {
      "id": 2,
      "productName": "Mouse",
      "quantity": 2,
      "price": 24.99
    }
  ]
}
```

**Key requirements:**
- `buyerName` is required (frontend displays this for sellers)
- `items` must only include items belonging to viewing seller (backend already filters)
- `totalPrice` must be calculated correctly
- `status` must be one of: "Pending", "Processing", "Shipped", "Delivered"

---

## 3. **Error Handling Requirements**

### HTTP Status Codes
The frontend expects these status codes with appropriate error messages:

| Status | When | Action |
|--------|------|--------|
| 200 | Success | Proceed normally |
| 400 | Bad request (invalid data) | Show message: `error.response.data.message` |
| 401 | Unauthorized (no/invalid token) | Show: "Session expired. Please log in again." |
| 403 | Forbidden (wrong role/ownership) | Show: "Unauthorized: You must have [role] role..." |
| 404 | Not found | Show: "Resource not found" |
| 500 | Server error | Show: "An error occurred. Please try again." |

### Response Format
All error responses should follow this format:

```json
{
  "message": "User-friendly error message",
  "title": "Optional error title",
  "status": 400
}
```

---

## 4. **Validation Rules**

### Rating Validation
- Rating must be 1-5 (inclusive)
- Reject 0 or 6+ with message: "Rating must be between 1 and 5"

### Comment Validation
- Comment text cannot be empty
- Comment text cannot exceed 1000 characters

### Status Update Validation
- Status value must be one of: "Pending", "Processing", "Shipped", "Delivered"
- Status can only be updated forward (no reverting)
- Only seller with product in order can update status
- Return 403 if seller doesn't own any product in the order

### Flag Validation
- Duplicate flags should return success but with message: "Already flagged"
- Don't create duplicate flag entries

---

## 5. **JWT Token Claims**

Token must include one of these for user ID extraction:
- `sub` (Subject claim - preferred)
- `nameid` (ClaimTypes.NameIdentifier)
- `id`
- `userId`

Token must include:
- `role` - claim for "Buyer" or "Seller"

Example decoded token:
```json
{
  "sub": "user-123",
  "email": "user@example.com",
  "role": "Buyer",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 6. **Testing Checklist for Backend**

- [ ] Seller token without "Seller" role is rejected on seller endpoints (403)
- [ ] Buyer token without "Buyer" role is rejected on buyer endpoints (403)
- [ ] Seller who doesn't own product in order cannot update status (403)
- [ ] Rating 0 or 6 is rejected with proper error message
- [ ] Ratings are upserted (update if exists, create if new)
- [ ] Comments are associated with correct order and buyer
- [ ] Average rating shows to 2 decimal places in summary
- [ ] Order comments are returned in correct format with timestamps
- [ ] Duplicate flags don't create duplicate entries
- [ ] Unauthorized users cannot modify orders they don't own

---

## 7. **Frontend Changes Made**

### ✅ Implemented
1. **ProductCard**: "No ratings yet" now links to product detail page for rating
2. **ProductDetails**: Display average rating to 2 decimal places
3. **BuyerOrders**: 
   - Users can add comments to orders
   - Comments are fetched and displayed
   - Refresh comments after adding
4. **SellerOrders**: 
   - Display buyer name and order creation date
   - Show quantity in item list
   - Display buyer comments with timestamps
   - Enhanced error messages for unauthorized access
5. **Error Handling**: All flows show user-friendly messages for 401/403 errors
6. **JWT Claims**: Support for `sub`, `nameid`, `id`, `userId` for user ID extraction

### 🔄 Dependent on Backend
The following frontend features depend on the `GET /api/Order/{orderId}/comments` endpoint:
- Displaying comments on SellerOrders page
- Showing comment history on BuyerOrders page

---

## 8. **Verification Steps**

After implementing backend changes:

1. Test GET /api/Order/seller returns orders with `buyerName`
2. Test POST /api/Order/{orderId}/comments creates comment
3. Test GET /api/Order/{orderId}/comments returns comments with timestamps
4. Test role-based access control (403 for wrong roles)
5. Test rating validation (reject 0 and >5)
6. Test duplicate flag handling
7. Test status update ownership validation
8. Verify JWT token has required claims

---

## 9. **Critical Missing Endpoint**

**🔴 This endpoint MUST be implemented for comments to work:**

```
GET /api/Order/{orderId}/comments
Authorization: Bearer <token>
Response: Array of comments with id, text, userId, createdAt
```

Without this endpoint, buyers can add comments but sellers won't see them in the order list.

---

**Last Updated**: 2026-04-14
**Frontend Build**: ✅ Passing
**Backend Status**: ⏳ Awaiting alignment
