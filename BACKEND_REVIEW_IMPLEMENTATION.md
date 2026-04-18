# Backend Review & Rating System - Implementation Specification

## Overview
Frontend is now complete with full review/rating system. Backend must implement corresponding APIs to receive, store, and serve review data.

**Current Date**: April 14, 2026  
**Status**: Frontend Ready ✅ | Backend Implementation Needed 🔄

---

## API Endpoints Required

### 1. CREATE PRODUCT REVIEW
**Endpoint**: `POST /api/review`

**Purpose**: Buyer submits a rating and comment on a product

**Request Body**:
```json
{
  "productId": 2,
  "rating": 5,
  "comment": "ggg"
}
```

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "productId": 2,
  "buyerId": 123,
  "rating": 5,
  "comment": "ggg",
  "createdAt": "2026-04-14T10:30:00Z",
  "updatedAt": "2026-04-14T10:30:00Z"
}
```

**Validation**:
- Rating must be between 1-5 (inclusive)
- Comment max length: 1000 characters
- Comment can be empty/null
- ProductId must exist
- User must be authenticated (role check: should be Buyer)
- One rating per product per buyer (UPSERT behavior)

**Error Responses**:
- `400 Bad Request`: Invalid rating (not 1-5) or validation failure
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User not in Buyer role
- `404 Not Found`: Product doesn't exist

**Behavior**: 
- If buyer already rated this product, UPDATE the existing review
- If new review, CREATE new record with timestamp

---

### 2. GET REVIEWS BY PRODUCT
**Endpoint**: `GET /api/review/product/{productId}`

**Purpose**: Fetch ALL reviews for a specific product (visible to all users including seller)

**Request Headers**:
```
Authorization: Bearer <jwt_token> (optional - can be anonymous)
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "productId": 2,
    "buyerId": 123,
    "rating": 5,
    "comment": "Great product, highly recommend",
    "createdAt": "2026-04-14T10:30:00Z",
    "updatedAt": "2026-04-14T10:30:00Z"
  },
  {
    "id": 2,
    "productId": 2,
    "buyerId": 456,
    "rating": 4,
    "comment": "Good quality",
    "createdAt": "2026-04-13T15:45:00Z",
    "updatedAt": "2026-04-13T15:45:00Z"
  }
]
```

**Behavior**:
- Returns empty array if no reviews exist
- Should return reviews ordered by creation date (newest first)
- Include buyer information if available (for display purposes, not just buyerId)
- Visible to: All users (buyers, sellers, anonymous)

**Error Responses**:
- `404 Not Found`: Product doesn't exist
- Returns `[]` if no reviews found (not an error)

---

### 3. GET REVIEW SUMMARY
**Endpoint**: `GET /api/review/summary/{productId}`

**Purpose**: Get aggregate rating data for product (average rating, total reviews count)

**Response (200 OK)**:
```json
{
  "productId": 2,
  "averageRating": 4.50,
  "totalReviews": 2,
  "ratingBreakdown": {
    "5": 1,
    "4": 1,
    "3": 0,
    "2": 0,
    "1": 0
  }
}
```

**Behavior**:
- Average rating calculated to 2 decimal places
- totalReviews = count of all reviews for product
- ratingBreakdown: count of reviews per rating (1-5 stars)
- Visible to: All users
- Returns summary even if no reviews (with 0 values)

**Error Responses**:
- `404 Not Found`: Product doesn't exist
- Should return default zeros if no reviews exist (not an error)

---

## Data Model

### Review Entity
```
ReviewDto {
  int id                          // Unique review ID
  int productId                   // FK to Product
  int buyerId                     // FK to User (Buyer)
  int rating                      // 1-5 stars (required)
  string comment                  // Optional comment, max 1000 chars
  DateTime createdAt              // UTC timestamp
  DateTime updatedAt              // UTC timestamp
}
```

### ReviewSummaryDto
```
ReviewSummaryDto {
  int productId
  decimal averageRating           // 2 decimal places (e.g., 4.50)
  int totalReviews
  Dictionary<int, int> ratingBreakdown  // { 5: 1, 4: 1, 3: 0, etc }
}
```

### Error Response Format
```json
{
  "error": "Invalid rating",
  "message": "Rating must be between 1 and 5",
  "status": 400
}
```

---

## Database Requirements

### Reviews Table Schema
```sql
CREATE TABLE Reviews (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id),
    BuyerId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(1000),
    CreatedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),
    UNIQUE (ProductId, BuyerId)  -- One review per product per buyer
);

CREATE INDEX IX_Reviews_ProductId ON Reviews(ProductId);
CREATE INDEX IX_Reviews_BuyerId ON Reviews(BuyerId);
```

---

## Authentication & Authorization

### Endpoint Access Control

| Endpoint | Anonymous | Buyer | Seller | Admin |
|----------|-----------|-------|--------|-------|
| POST /api/review | ❌ | ✅ Only own | ❌ | ✅ |
| GET /api/review/product/{id} | ✅ | ✅ | ✅ | ✅ |
| GET /api/review/summary/{id} | ✅ | ✅ | ✅ | ✅ |

### User Role Check
- For POST /api/review: Extract userid from JWT token and verify role is "Buyer"
- For GET endpoints: No role restriction (public read)

---

## Frontend Integration Points

### 1. ProductCard Component
- Displays average rating with star count
- Shows 1 recent review preview (comment snippet + rating badge)
- "Rate This Product" button navigates to ProductDetails
- Fetches recent reviews using `GET /api/review/product/{productId}`

### 2. ProductDetails Component
- Shows review form (interactive stars 1-5, textarea for comment ≤1000 chars)
- Displays all reviews with timestamps and star ratings
- Calls `POST /api/review` to submit reviews
- Calls `GET /api/review/product/{productId}` to fetch all reviews
- Calls `GET /api/review/summary/{productId}` for average rating display

### 3. Seller Portal
- Can view all reviews for their products (product details page)
- Reviews show buyer ratings and feedback
- Helps seller understand customer satisfaction

### 4. API Base URL
```
http://localhost:5269
```
All endpoints: `http://localhost:5269/api/review/*`

---

## Example User Flow

### Buyer Flow
1. **Browse**: Sees ProductCard with rating (2.5★) and recent review snippet
2. **Click "Rate This Product"**: Navigates to ProductDetails
3. **Rate**: Selects 5 stars from StarRating component
4. **Comment**: Types "Great product, highly recommend" in textarea
5. **Submit**: Frontend POST `/api/review` with `{productId: 2, rating: 5, comment: "Great product, highly recommend"}`
6. **Backend**: Validates, stores in Reviews table, returns 200 OK
7. **Display**: Review appears in product reviews list immediately
8. **Seller**: Can view this review on their product details page

### Seller Flow
1. **Dashboard**: Views product details
2. **Reviews Section**: Sees all customer reviews and ratings
3. **Analytics**: Reviews help improve product quality based on feedback

---

## Testing Scenarios

### Scenario 1: First Review on Product
- POST with rating=5, comment="Excellent"
- GET /product/{id} returns this review
- GET /summary/{id} returns averageRating=5.0, totalReviews=1

### Scenario 2: Multiple Reviews
- 3 reviews: 5★, 4★, 3★
- averageRating = (5+4+3)/3 = 4.0
- ratingBreakdown = {5:1, 4:1, 3:1, 2:0, 1:0}

### Scenario 3: Review Update (Upsert)
- Buyer posts initial review (5★, comment="Good")
- Same buyer posts new review (3★, comment="Disappointed")
- Old review replaced, not added (UPSERT behavior)
- totalReviews stays at 1, averageRating updated to 3.0

### Scenario 4: No Reviews
- GET /review/product/{id} returns `[]`
- GET /summary/{id} returns averageRating=0, totalReviews=0

### Scenario 5: Invalid Rating
- POST with rating=6 → 400 Bad Request
- POST with rating=0 → 400 Bad Request
- POST with rating=2.5 → 400 Bad Request (must be integer 1-5)

### Scenario 6: Comment Too Long
- POST with comment >1000 chars → 400 Bad Request

### Scenario 7: Authorization
- Non-authenticated request to POST /api/review → 401 Unauthorized
- Seller attempting to POST /api/review → 403 Forbidden
- GET endpoints work for all users (public)

---

## Response Codes Summary

```
200 OK              - Review created/retrieved successfully
400 Bad Request     - Validation failure (rating 1-5, comment length, etc)
401 Unauthorized    - Missing/invalid JWT token
403 Forbidden       - User role not Buyer (for POST)
404 Not Found       - Product doesn't exist
500 Server Error    - Unexpected error
```

---

## Notes for Backend Developer

1. **UPSERT Pattern**: Use UNIQUE constraint on (ProductId, BuyerId) to enforce one review per buyer
   - On conflict, UPDATE instead of INSERT
   
2. **Timestamp Handling**: All times in UTC ISO 8601 format (e.g., "2026-04-14T10:30:00Z")

3. **Decimal Precision**: Average rating = SUM(rating) / COUNT(*) to 2 decimal places

4. **Security**: 
   - Verify JWT token before accepting POST requests
   - Verify user is Buyer role
   - Never allow user to modify other users' reviews

5. **Performance**: 
   - Index on ProductId for fast lookups
   - Cache summary calculations if needed (refreshed on new review)

6. **Null Handling**:
   - Comment is nullable (buyer can rate without comment)
   - Empty reviews array `[]` not error
   - Summary should return defaults if no reviews

---

## Postman Collection Template

```json
{
  "POST_CreateReview": {
    "method": "POST",
    "url": "http://localhost:5269/api/review",
    "headers": {
      "Authorization": "Bearer {{token}}",
      "Content-Type": "application/json"
    },
    "body": {
      "productId": 2,
      "rating": 5,
      "comment": "Great product!"
    }
  },
  "GET_ReviewsByProduct": {
    "method": "GET",
    "url": "http://localhost:5269/api/review/product/2"
  },
  "GET_ReviewSummary": {
    "method": "GET",
    "url": "http://localhost:5269/api/review/summary/2"
  }
}
```

---

## Alignment Checklist

- [ ] Reviews table created with proper constraints
- [ ] ReviewDto defined with validation attributes
- [ ] ReviewSummaryDto defined  
- [ ] POST /api/review endpoint implemented
- [ ] GET /api/review/product/{productId} endpoint implemented
- [ ] GET /api/review/summary/{productId} endpoint implemented
- [ ] JWT authentication/authorization implemented
- [ ] Upsert logic (one review per buyer per product)
- [ ] Validation: rating 1-5, comment ≤1000 chars
- [ ] Error responses match spec (400/401/403/404)
- [ ] All responses use correct DTOs
- [ ] Timestamps in UTC ISO 8601 format
- [ ] Database indexes created
- [ ] Postman tests passing for all scenarios
- [ ] Frontend integration tested end-to-end

---

## Frontend Code References

**Frontend Endpoints Called**:
```javascript
// src/services/reviewService.js
POST /api/review                    // createReview(data)
GET /api/review/product/{productId} // getReviewsByProduct(productId)
GET /api/review/summary/{productId} // getReviewSummary(productId)
```

**Frontend Features**:
- ProductCard shows review preview + "Rate This Product" button
- ProductDetails shows review form + all reviews list
- Automatic refresh after submitting new review
- Error handling with user-friendly messages

---

## Questions / Clarifications

If any ambiguities arise, reference this spec first. All fields, endpoints, and behaviors are defined above.

For backend and frontend to align perfectly, both teams should follow this specification exactly.
