# ⚡ BACKEND TEAM PROMPT - Implementation Guide

**FROM**: Frontend Team  
**TO**: Backend Team  
**DATE**: April 14, 2026  
**PRIORITY**: 🔴 HIGH

---

## Executive Summary

The frontend is **BUILD READY** (✅ 126.41 KB, fully functional). 

To complete the Marketplace integration, **you must implement 5 backend requirements** by end of business [DATE].

**Time Estimate**: 4-6 hours for experienced backend dev  
**Complexity**: Medium  
**Risk**: Low (non-breaking, additive only)

---

## What Changed on Frontend?

✅ **SellerDashboard** - Now shows complete order details with buyer comments  
✅ **ProductCard** - Larger images (280px) for better UX  
✅ **Rating System** - Client-side validation (1-5, max 1000 chars)  
✅ **Order Status** - Added "Cancelled" state (now 5 states instead of 4)  
✅ **Comments Display** - Sellers can now see buyer notes on orders  

**Frontend Build**: ✅ PASSING - no errors or breaking changes

---

## 5 Backend Requirements to Implement

### 🔴 CRITICAL (Blocking)

#### 1. Implement GET /api/Order/{orderId}/comments
**What**: Fetch all comments for a specific order  
**Why**: SellerDashboard needs to display buyer comments  
**Status**: MISSING (this endpoint doesn't exist)

```http
GET /api/Order/{orderId}/comments
Authorization: Bearer <token>
```

**Response (200 OK)**:
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
    "text": "Thanks!",
    "createdAt": "2026-04-14T15:45:00Z"
  }
]
```

**Validation**:
- Only buyer/seller of order can see comments (403 if unauthorized)
- Return empty array `[]` if no comments exist
- Return 404 gracefully (frontend treats as empty)

**Est. Time**: 30 min

---

#### 2. Add "Cancelled" Status to Order Enum
**What**: Add new status value to order lifecycle  
**Why**: Users need ability to cancel orders at any time  
**Status**: MISSING (not in enum)

**Update Enum** to support:
```csharp
enum OrderStatus {
  Pending,
  Processing,
  Shipped,
  Delivered,
  Cancelled  // ← NEW
}
```

**Rules**:
- Can transition TO "Cancelled" from ANY state
- Can transition FROM "Cancelled" ONLY (can't revert)
- Only seller with product ownership or buyer can cancel
- Use exact string: `"Cancelled"` (not "Cancel" or "Canceled")

**Affected Endpoints**:
- PUT /api/Order/{id}/status
- GET /api/Order/my
- GET /api/Order/seller

**Est. Time**: 15 min

---

#### 3. Ensure OrderResponseDto Includes All Required Fields
**What**: Verify order objects have all data frontend needs  
**Why**: SellerDashboard displays these directly  
**Status**: PARTIAL (missing buyerName, might be missing createdAt)

**Required Fields** (must include):
```json
{
  "id": 123,
  "buyerId": 456,
  "buyerName": "John Doe",        // ← CRITICAL: needed for display
  "status": "Processing",
  "createdAt": "2026-04-14T10:00:00Z",  // ← CRITICAL: for sorting/display
  "totalPrice": 149.99,
  "items": [
    {
      "id": 1,
      "productName": "Laptop",           // ← CRITICAL: for list
      "quantity": 1,
      "price": 999.99
    }
  ]
}
```

**Verify**:
- [ ] `buyerName` not null, not empty
- [ ] `createdAt` is ISO 8601 format
- [ ] `items[].productName` is populated
- [ ] All numeric fields are numbers (not strings)

**Est. Time**: 20 min

---

### 🟡 IMPORTANT (Non-blocking but recommended)

#### 4. Add Input Validation for Reviews
**What**: Server-side validation for rating and comment  
**Why**: Defense-in-depth (frontend validates, backend should too)  
**Status**: PARTIAL (might exist, needs verification)

**Validation Rules**:
- Rating must be: 1 ≤ rating ≤ 5
- Comment must be: 0 < length ≤ 1000
- Return 400 with error message if invalid

```json
{
  "status": 400,
  "message": "Rating must be between 1 and 5",
  "errors": {
    "rating": ["Value must be between 1 and 5"]
  }
}
```

**Behavior**:
- Reject rating = 0 with message: "Rating must be between 1 and 5"
- Reject rating = 6 with message: "Rating must be between 1 and 5"
- Reject empty comment: "Comment cannot be empty" (if required)
- Reject comment >1000: "Comment too long"

**Est. Time**: 15 min

---

#### 5. Update PUT /api/Order/{id}/status - Accept New Values
**What**: Accept "Cancelled" in status update endpoint  
**Why**: Endpoint needs to handle all 5 status values  
**Status**: PARTIAL (currently only accepts 3-4 values)

**Backward Compatible**:
```
✅ Still accept: "Pending", "Processing", "Shipped", "Delivered"
❌ Stop accepting: "Accepted" (not valid anymore)
✅ NOW accept: "Cancelled"
```

**Validation**:
- Compare exact string values (case-insensitive input, exact case output)
- Only allow forward progression (except Cancelled which is always allowed)
- Return 403 if seller doesn't own product in order
- Return 400 if invalid status value

**Response on Success**:
```json
{
  "message": "Order status updated successfully",
  "status": "Cancelled"
}
```

**Est. Time**: 10 min

---

## Testing Checklist for Backend

Run these tests before marking "DONE":

### Comments Feature
- [ ] GET /api/Order/123/comments returns array for valid order
- [ ] GET /api/Order/123/comments returns 401 if not authenticated
- [ ] GET /api/Order/123/comments returns 403 if user doesn't have permission
- [ ] GET /api/Order/123/comments returns [] (empty) if no comments
- [ ] POST /api/Order/123/comments creates comment successfully
- [ ] Can fetch comment with createdAt timestamp

### Cancelled Status
- [ ] Pending → Cancelled ✅ works
- [ ] Processing → Cancelled ✅ works
- [ ] Shipped → Cancelled ✅ works
- [ ] Delivered → Cancelled ✅ works
- [ ] Cancelled → Pending ❌ fails correctly
- [ ] Status value is exactly "Cancelled" (not "Cancel")
- [ ] UI shows all 5 status buttons

### Order Data
- [ ] GET /api/Order/my returns buyerName for each order
- [ ] GET /api/Order/seller returns buyerName for each order
- [ ] All orders have createdAt in ISO format
- [ ] Items array populated with productName

### Validation
- [ ] Rating = 0 rejected with message
- [ ] Rating = 6 rejected with message
- [ ] Rating = 1-5 accepted
- [ ] Comment >1000 chars rejected with message
- [ ] Comment ≤1000 chars accepted

---

## Implementation Checklist

**BEFORE Starting**:
- [ ] Read entire document
- [ ] Check estimated times vs sprint capacity
- [ ] Create feature branch

**DEVELOPMENT**:
- [ ] Implement GET /api/Order/{orderId}/comments
- [ ] Add Cancelled to status enum
- [ ] Verify OrderResponseDto fields
- [ ] Add validation for ratings
- [ ] Update PUT /api/Order/{id}/status

**TESTING**:
- [ ] Run all tests in Testing Checklist
- [ ] Integration test: Seller Dashboard displays comments
- [ ] Integration test: Cancel button works
- [ ] Verify no breaking changes to existing endpoints

**DEPLOYMENT**:
- [ ] Merge to develop
- [ ] Deploy to staging
- [ ] Notify frontend team (send deployment link)
- [ ] Frontend team runs integration tests

---

## Integration Testing (After Backend Deploys)

Frontend team will test:
1. ✅ SellerDashboard shows buyer comments
2. ✅ Cancelled status appears in all order lists
3. ✅ Status update to Cancelled works
4. ✅ Rating validation prevents invalid submissions
5. ✅ ProductCard images display at 280px

---

## Reference Documentation

**Detailed Specs**: See `BACKEND_REQUIREMENTS.md` in marketplace-buyer repo  
**Frontend Changes**: See `CHANGES_SUMMARY.md`  
**API Alignment**: See `BACKEND_ALIGNMENT.md`

---

## Success Criteria

**Backend Implementation is DONE when**:
- ✅ Endpoint GET /api/Order/{orderId}/comments exists and returns correct data
- ✅ OrderStatus enum includes "Cancelled"
- ✅ OrderResponseDto includes buyerName and createdAt
- ✅ Rating validation (1-5, ≤1000 chars) enforced
- ✅ PUT /api/Order/{id}/status accepts all 5 status values
- ✅ All tests in Testing Checklist pass
- ✅ Frontend integration tests pass
- ✅ Zero breaking changes to existing API contracts

---

## Quick Reference: Changed Payloads

### NEW Endpoint
```
GET /api/Order/{orderId}/comments → Array of comment objects
```

### UPDATED Endpoint
```
PUT /api/Order/{id}/status
{
  "status": "Cancelled"  // ← NEW value now accepted
}
```

### UPDATED DTO
```json
{
  "id": 123,
  "buyerName": "...",           // ← Ensure included
  "createdAt": "2026-04-14...", // ← Ensure included
  "items": [{
    "productName": "...",       // ← Ensure included
    ...
  }],
  ...
}
```

---

## Contact & Questions

**Frontend Point**: [Your name/team]  
**Blocked On**: Backend completion of these 5 items  
**Expected Delivery**: [DATE]  
**Critical Path**: Yes

**If blocked or have questions**:
1. Reference BACKEND_REQUIREMENTS.md
2. Check Testing Checklist
3. Reach out to frontend team

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Frontend Implementation | ✅ DONE | Complete |
| Backend Implementation | ⏳ TODO | 4-6 hours |
| Integration Testing | ⏳ TODO | 1-2 hours |
| Deployment | ⏳ TODO | 30 min |
| Go Live | ⏳ TODO | [DATE] |

---

**Prepared By**: Frontend Team  
**Date**: April 14, 2026  
**Priority**: 🔴 HIGH - BLOCKING FEATURE  
**Action**: Review and begin implementation immediately

