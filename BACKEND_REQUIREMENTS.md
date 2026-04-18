# Backend API Requirements - Frontend Alignment Update
**Generated**: April 14, 2026  
**Status**: ✅ Frontend Build Passing  
**Size**: 126.41 KB (gzipped)

---

## 📋 Summary of Required Changes

The frontend has been updated with the following new features and fixes. The backend **MUST** implement these changes for full functionality:

### New Features & Fixes
1. ✅ **SellerDashboard Page Overhaul** - Now shows full order details with comments
2. ✅ **Order Status Support** - Added "Cancelled" status to all workflows
3. ✅ **Rating Validation** - Added client-side validation (1-5 range, 1000 char comments)
4. ✅ **ProductCard Images** - Increased image height from 200px to 280px
5. ✅ **Order Comments on SellerDashboard** - Now displays buyer comments per order

---

## 🔴 Critical Backend Implementation Requirements

### 1. **Order Status Values - NOW INCLUDES "Cancelled"**

**Status Progression** (in order of progression):
```
Pending → Processing → Shipped → Delivered → Cancelled
```

**Updated from**: Pending → Processing → Shipped → Delivered

**Changes Required**:
- Enum/constant must support: `["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]`
- Status can move forward OR to "Cancelled" at any point
- Example valid transitions:
  - Processing → Shipping ✅
  - Pending → Cancelled ✅
  - Shipped → Cancelled ✅
  - Processing → Pending ❌ (INVALID - only forward)
  - Delivered → Pending ❌ (INVALID - terminal state)

**Affected Endpoints**:
- PUT /api/Order/{id}/status
- GET /api/Order/my
- GET /api/Order/seller
- GET /api/Order/{id}/comments

---

### 2. **OrderResponseDto Structure - VERIFIED & REQUIRED**

Every order endpoint must return orders in this exact format:

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

**Critical Fields**:
- `id` ✅ Order ID
- `buyerId` ✅ Buyer's user ID (for comments filtering)
- `buyerName` ✅ **Buyer's display name** (required for SellerDashboard)
- `status` ✅ Must be one of: Pending, Processing, Shipped, Delivered, Cancelled
- `createdAt` ✅ ISO 8601 timestamp (for display in SellerDashboard)
- `totalPrice` ✅ Sum of all items
- `items` ✅ Array with productName, quantity, price

**If any field is missing, frontend will display "Unknown" or "0"**

---

### 3. **Comments Endpoint - CRITICAL MISSING**

**THIS ENDPOINT MUST BE IMPLEMENTED** for comments to work in SellerDashboard:

```
GET /api/Order/{orderId}/comments
Authorization: Bearer <token>
Response: 200 OK
```

**Expected Response**:
```json
[
  {
    "id": 1,
    "orderId": 123,
    "userId": 456,
    "text": "Please deliver after 5 PM",
    "createdAt": "2026-04-14T10:30:00Z"
  },
  {
    "id": 2,
    "orderId": 123,
    "userId": 456,
    "text": "Thanks for the fast shipping!",
    "createdAt": "2026-04-14T15:45:00Z"
  }
]
```

**On Error**:
- 404 Not Found → Frontend treats as empty array (graceful)
- 401 Unauthorized → Show "Session expired. Please log in again."
- 403 Forbidden → Show "You don't have permission to view comments"

**Returns empty array if no comments exist** ✅

---

### 4. **POST /api/Order/{orderId}/comments - ALREADY IMPLEMENTED**

```
POST /api/Order/{orderId}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Please deliver before 5 PM"
}
```

**Validation Required**:
- ✅ Text must not be empty
- ✅ Text must be ≤ 1000 characters
- ✅ Only order buyer can add comments (403 if not)
- ✅ Returns success response with comment details

**Frontend validates**:
- Empty text → Shows warning
- >1000 chars → Shows error

---

### 5. **PUT /api/Order/{id}/status - STATUS VALUES UPDATED**

```
PUT /api/Order/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Cancelled"
}
```

**Now Accepts** (case-insensitive):
```
"Pending", "Processing", "Shipped", "Delivered", "Cancelled"
```

**Previously Accepted** (REMOVE SUPPORT):
- "Accepted" ❌ Use "Processing" instead

**Validation**:
- ✅ Only forward progression (no reverting)
- ✅ Cancellation allowed from any state except Delivered
- ✅ Only seller with product in order can update (403 if not)
- ✅ Only "Seller" role allowed (403 if Buyer tries)

---

### 6. **Rating Validation - CLIENT-SIDE IMPLEMENTED**

Frontend now validates before sending:

```javascript
// Frontend validation
if (rating < 1 || rating > 5) {
  error: "Rating must be between 1 and 5 stars"
}

if (comment.length > 1000) {
  error: "Comment must be less than 1000 characters"
}
```

**Backend Should Also Validate**:
- ✅ Rating ∈ [1, 5]
- ✅ Comment length ≤ 1000
- ✅ Comment cannot be empty (optional field)

**Error Response Format**:
```json
{
  "status": 400,
  "message": "Rating must be between 1 and 5",
  "errors": {
    "rating": ["Value must be between 1 and 5"]
  }
}
```

---

## 🎯 Specific Backend Updates Needed

### A. Database Schema

**OrderComments Table** (if not exists):
```
id (PK) | orderId (FK) | userId (FK) | text | createdAt | updatedAt
```

**Order Table Updates**:
- Ensure `createdAt` field exists (ISO 8601 format)
- Ensure `buyerId` and `buyerName` are available
- Status enum includes: "Cancelled"

---

### B. API Endpoints Checklist

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| /api/Order/my | GET | ✅ | Needs `buyerName`, includes Cancelled |
| /api/Order/seller | GET | ✅ | Needs `buyerName`, includes Cancelled |
| /api/Order/{id}/status | PUT | ✅ | Accept Cancelled, reject "Accepted" |
| /api/Order/{id}/comments | POST | ✅ | Validate 1-1000 chars |
| /api/Order/{id}/comments | GET | 🔴 | **MUST IMPLEMENT** |
| /api/Review | POST | ✅ | Validate 1-5, ≤1000 chars |
| /api/Review/product/{id} | GET | ✅ | Return rating per review |
| /api/Review/summary/{id} | GET | ✅ | Show 2 decimals |

---

### C. Error Response Standards

All endpoints should return this format:

```json
{
  "status": 400,
  "message": "User-friendly error message",
  "title": "Optional error title",
  "errors": {
    "fieldName": ["Specific validation error"]
  }
}
```

**Frontend Maps These HTTP Status Codes**:
- 400 → Show `message` field
- 401 → Show "Session expired. Please log in again."
- 403 → Show "Unauthorized: [specific reason]"
- 404 → Show "Resource not found"
- 500 → Show "An error occurred. Please try again."

---

## 🧪 Testing Checklist

Backend team **MUST** test these scenarios:

### Order Status Tests
- [ ] Seller can update Pending → Processing ✅
- [ ] Seller can update Processing → Shipped ✅
- [ ] Seller can update Shipped → Delivered ✅
- [ ] Seller can update ANY status → Cancelled ✅
- [ ] Seller CANNOT revert status backwards ✅
- [ ] Seller who doesn't own product gets 403 ✅
- [ ] Buyer gets 403 on PUT /api/Order/{id}/status ✅

### Comments Tests
- [ ] GET /api/Order/{orderId}/comments returns array ✅
- [ ] Comments include `text`, `createdAt`, `userId` ✅
- [ ] Only order buyer can see own comments ✅
- [ ] Seller can see buyer's comments ✅
- [ ] POST comment validates ≤1000 chars ✅
- [ ] Duplicate comments allowed ✅

### Rating Tests
- [ ] Rating 0 rejected ✅
- [ ] Rating 6 rejected ✅
- [ ] Rating 1-5 accepted ✅
- [ ] Comment >1000 chars rejected ✅
- [ ] Ratings upsert (update if exists, create new) ✅

### Data Format Tests
- [ ] OrderResponseDto includes `buyerName` ✅
- [ ] OrderResponseDto includes `createdAt` ✅
- [ ] Status value exactly matches: "Cancelled" (case-sensitive) ✅
- [ ] Items array includes `productName`, `quantity`, `price` ✅

---

## 📱 Frontend Changes Made

### Pages Updated
1. **SellerDashboard.js**
   - Imports: `getOrderComments` from orderService
   - Displays: Buyer comments section per order
   - Shows: All order items with quantities
   - Status buttons: Now includes "Cancelled"
   - Enhanced: Toast notifications for errors

2. **ProductDetails.js**
   - Added: Rating validation (1-5)
   - Added: Comment length validation (≤1000)
   - Shows: Error messages before submission

3. **ProductCard.js**
   - Image height: 200px → **280px** (larger)
   - Rating text: "No ratings yet" → clickable link to ProductDetails

4. **SellerOrders.js, BuyerOrders.js**
   - Status options: Now includes "Cancelled"

5. **OrderCard.js** (Component)
   - Status progression: Now includes "Cancelled"

### Services Updated
1. **orderService.js**
   - New function: `getOrderComments(orderId)`
   - Calls: GET /api/Order/{orderId}/comments

### Build Status
✅ **Build Successful** (126.41 KB gzipped)
- No critical errors
- Only pre-existing warnings (unused imports, hook dependencies)

---

## 🚀 Deployment Steps

### Backend Team
1. Add "Cancelled" to Order Status enum
2. Implement GET /api/Order/{orderId}/comments endpoint
3. Update OrderResponseDto to include `buyerName` and `createdAt`
4. Add validation for rating (1-5) and comment (≤1000 chars)
5. Test all scenarios in checklist above
6. Ensure error responses match the format specified

### Frontend Team
1. Latest changes already applied
2. No additional frontend work needed
3. Build passes with no breaking errors

### Integration
1. Deploy backend changes first
2. Deploy frontend changes
3. Run integration tests
4. Verify SellerDashboard displays comments correctly
5. Verify status updates including Cancelled work

---

## 📝 Notes for Backend Developer

### Important Details
- **Case Sensitivity**: Status values are case-insensitive in requests but stored as exact strings
- **Cancelled vs Cancel**: Must be "Cancelled" (not "Cancel" or "Canceled")
- **Comments Visibility**: Only buyer/seller of order can see comments
- **Decimal Places**: Average ratings display to 2 decimal places (e.g., 4.50)
- **Timestamps**: Must be ISO 8601 format for proper JS Date parsing

### Frontend Debugging
If comments don't show:
1. Verify GET /api/Order/{orderId}/comments returns array
2. Check status code is 200
3. Verify response has `text` and `createdAt` fields
4. Check browser console for fetch errors
5. Verify Authorization header is sent

If status update fails:
1. Check backend validates forward-only progression
2. Verify seller owns product in order
3. Check token has "Seller" role
4. Verify status value matches enum exactly

---

## ✅ Frontend Status: READY FOR BACKEND INTEGRATION

All frontend changes complete and tested. Backend implementation of above requirements will enable:
- ✅ Full SellerDashboard functionality
- ✅ Order comments visibility on seller side
- ✅ Cancelled order status support
- ✅ Complete order lifecycle management
- ✅ User-friendly error handling

**Please implement the requirements above and notify frontend team when ready for integration testing.**

---

**Last Updated**: 2026-04-14 16:45 UTC  
**Frontend Version**: 0.1.0  
**Build Tool**: React Scripts 5.x  
**API Base**: http://localhost:5269/
