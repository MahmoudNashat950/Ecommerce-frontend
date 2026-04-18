# Implementation Notes & Architecture Guide

## 📊 Project Structure

```
src/
├── api/
│   └── api.js                    # Axios instance with interceptors
├── apps/
│   ├── BuyerApp.js
│   └── SellerApp.js
├── components/
│   ├── AlertMessage.js           # Legacy (use Toast now)
│   ├── CategoryCard.js
│   ├── EmptyState.js             # ✨ NEW - Generic empty state
│   ├── Footer.js
│   ├── LoadingSkeletons.js       # ✨ NEW - Skeleton loaders
│   ├── LoadingSpinner.js         # Legacy
│   ├── Navbar.js
│   ├── OrderCard.js
│   ├── OrderStatusBadge.js       # ✨ NEW - Status badge
│   ├── ProductCard.js            # ⬆️ UPGRADED
│   ├── PromoCarousel.js
│   ├── ProtectedRoute.js
│   ├── SearchBar.js
│   ├── SearchInput.js
│   ├── StarRating.js             # ⬆️ UPGRADED
│   ├── ToastContainer.js         # ✨ NEW - Toast system
│   └── ToastMessage.js           # Legacy
├── hooks/                         # ✨ NEW FOLDER
│   └── useToast.js               # ✨ NEW - Toast management
├── pages/
│   ├── BuyerCatalog.js
│   ├── BuyerOrders.js            # ⬆️ UPGRADED
│   ├── Categories.js
│   ├── FlagBuyer.js
│   ├── FlagSeller.js
│   ├── Home.js
│   ├── Login.js
│   ├── Orders.js
│   ├── ProductDetails.js         # ⬆️ UPGRADED
│   ├── Products.js               # ⬆️ UPGRADED
│   ├── Register.js
│   ├── Seller.js
│   ├── SellerDashboard.js
│   ├── SellerOrders.js           # ⬆️ UPGRADED
│   ├── SellerProductEdit.js
│   └── SellerProducts.js
├── services/
│   ├── authService.js
│   ├── categoryService.js
│   ├── flagService.js
│   ├── orderService.js           # Contains API calls
│   ├── productService.js
│   └── reviewService.js
├── types/
│   └── product.js                # Constants (DEFAULT_PRODUCT_IMAGE)
├── utils/
│   └── auth.js                   # JWT token utilities
├── App.css                        # ⬆️ COMPLETE REDESIGN
├── App.js
├── App.test.js
├── index.css
├── index.js
└── setupTests.js
```

---

## 🔄 Data Flow

### **Order Creation Flow**
```
User clicks "Order Now"
    ↓
ProductCard calls onAddToCart(productId)
    ↓
Products.handlePlaceOrder(productId)
    ↓
createOrder API call
    ↓
✅ Success: Toast + Redirect to /buyer/orders
❌ Error: Toast with error message
```

### **Component Communication**
```
Pages (smart components)
├── State: orders, loading, error
├── useToast: { toasts, addToast, removeToast }
└── Render Components (dumb components)
    ├── ProductCard
    ├── OrderCard
    ├── ToastContainer
    └── EmptyState
```

---

## 🛡️ Error Handling

### **Service Layer**
```javascript
// api/api.js
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error..."
      });
    }
    return Promise.reject(error);
  }
);
```

### **Component Level**
```javascript
try {
  await someAPI();
  addToast({ variant: "success", message: "✅ Success!" });
} catch (err) {
  addToast({
    variant: "error",
    message: err.message || "Operation failed"
  });
  setError(err);
}
```

---

## 📲 State Management Strategy

### **Local Component State**
- Used for: UI state, form inputs, loading flags
- Example: `const [loading, setLoading] = useState(true)`

### **Custom Hooks**
- Used for: Shared logic across components
- Example: `useToast()` - Toast notification state

### **localStorage**
- Used for: Authentication token, user preferences
- Example: `localStorage.getItem("token")`

### **URL Params**
- Used for: Product ID, order ID navigation
- Example: `/product/:id`, `/order/:id`

---

## ⚡ Performance Optimizations

### **1. Skeleton Loaders**
Instead of spinner, show skeleton matching layout:
```javascript
if (loading) return <ProductCardSkeletonGrid count={8} />;
```
**Why:** Better perceived performance, no layout shift

### **2. Array Validation**
```javascript
const validOrders = Array.isArray(data) ? data : [];
validOrders.filter(o => o && o.id);
```
**Why:** Prevents crashes from null/undefined data

### **3. Disabled Button States**
```javascript
<button disabled={orderingId === product.id}>
  {disabled ? "..." : "Order Now"}
</button>
```
**Why:** Prevents double-submit, clear feedback

### **4. Auto-dismissing Toasts**
```javascript
useEffect(() => {
  const timer = setTimeout(() => removeToast(id), 4000);
  return () => clearTimeout(timer);
}, [id, duration]);
```
**Why:** Reduces clutter, auto-cleanup

---

## 🎯 Key Improvements Over Original

| Feature | Before | After |
|---------|--------|-------|
| **Loading UI** | LoadingSpinner | Skeleton loaders |
| **Notifications** | Alert + State | Toast system |
| **Empty States** | Basic text | Beautiful with CTA |
| **Order Flow** | Alert, no redirect | Toast + Auto-redirect |
| **Rating** | Basic input | Interactive stars |
| **Status Display** | Text only | Badges with icons |
| **Cards** | Simple layout | Modern with hover |
| **Price Format** | Basic | Discount badge + strikethrough |
| **Progress** | None | Visual progress bar |
| **Responsive** | Basic | Full responsive grid |
| **CSS** | Bootstrap only | Custom design system |

---

## 🔗 API Endpoints Used

### **GET Endpoints**
```javascript
GET /api/Product?keyword=...      // Get products (with search)
GET /api/Product/:id              // Get product details
GET /api/Review/product/:id       // Get reviews for product
GET /api/Review/summary/:id       // Get review summary
GET /api/Order/my                 // Get buyer's orders
GET /api/Order/seller             // Get seller's orders
```

### **POST Endpoints**
```javascript
POST /api/Order                   // Create new order
POST /api/Review                  // Create review
POST /api/Order/:id/comments      // Add order comment
```

### **PUT Endpoints**
```javascript
PUT /api/Order/:id/status         // Update order status
```

### **DELETE Endpoints**
```javascript
DELETE /api/Product/:id           // Delete product
```

---

## 🧪 Testing Guide

### **1. Test Product Flow**
- [ ] Navigate to /products
- [ ] See skeleton loading briefly
- [ ] See product cards
- [ ] Click "View" → go to details
- [ ] Click "Order Now" → success toast
- [ ] Auto-redirect to /buyer/orders
- [ ] See order with progress bar

### **2. Test Rating System**
- [ ] On ProductDetails, hover stars
- [ ] Click to select rating
- [ ] See "You selected" feedback
- [ ] Add comment (optional)
- [ ] Submit review
- [ ] See success toast
- [ ] Review appears in list

### **3. Test Search**
- [ ] Type search term
- [ ] Click "Search" button
- [ ] See filtered products
- [ ] Clear search → all products return
- [ ] Search with no results → empty state

### **4. Test Seller Orders**
- [ ] Navigate to /seller/orders
- [ ] See all orders
- [ ] Click status buttons
- [ ] Status updates (prevents backward)
- [ ] Side stats update

### **5. Test Empty States**
- [ ] With no products → empty state
- [ ] With no orders → empty state
- [ ] With CTA buttons work

### **6. Test Responsive**
- [ ] Resize to mobile (320px)
- [ ] Resize to tablet (768px)
- [ ] Resize to desktop (1024px)
- [ ] All layouts work

---

## 🚀 Deployment Checklist

- [ ] Remove console.logs (except errors)
- [ ] Test all flows end-to-end
- [ ] Run production build: `npm run build`
- [ ] Test build locally: `serve -s build`
- [ ] Check for console errors
- [ ] Verify API endpoints accessible
- [ ] Test on slow network (DevTools throttle)
- [ ] Test on real mobile device
- [ ] Check lighthouse score
- [ ] Enable gzip compression on server
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics
- [ ] Deploy to production

---

## 💾 Local Storage Usage

```javascript
// Token storage
localStorage.setItem("token", jwtToken);
localStorage.getItem("token");
localStorage.removeItem("token");

// On logout
localStorage.clear();
```

---

## 🔐 Authentication Flow

```javascript
// Login successful
const token = response.data.token;
localStorage.setItem("token", token);

// Protected routes check
const token = localStorage.getItem("token");
if (!token) navigate("/login");

// API calls auto-include token
// (via interceptor in api.js)
```

---

## 📝 Code Style Guide

### **Components**
```javascript
function ComponentName() {
  // Hooks first
  const { data } = useHook();
  const [state, setState] = useState();

  // Effects next
  useEffect(() => {}, []);

  // Event handlers
  const handleClick = () => {};

  // Render
  return <div>JSX</div>;
}
```

### **Naming**
- Components: PascalCase (`ProductCard`)
- Functions/Variables: camelCase (`handleClick`, `totalPrice`)
- Classes: PascalCase (`Product`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_PRODUCT_IMAGE`)

### **Comments**
```javascript
// Section comments
// ========== LOAD PRODUCTS ==========

// Inline comments for complex logic
const finalPrice = price - (price * discount / 100); // Calculate with discount
```

---

## 🐛 Common Issues & Solutions

### **Issue: Toast doesn't show**
**Solution:** Make sure `<ToastContainer>` is rendered at page level

### **Issue: Order not redirecting**
**Solution:** Check `/buyer/orders` route exists and user has token

### **Issue: Skeleton flashes too fast**
**Solution:** Adjust loading state timing or use actual delay

### **Issue: Rating stars not clickable**
**Solution:** Check `readOnly={false}` and `onChange` callback provided

### **Issue: Orders not loading from API**
**Solution:** Check `/api/Order/my` endpoint returns array, not null

---

## 📚 Further Reading

- [React Hooks Documentation](https://react.dev/reference/react)
- [Bootstrap Grid System](https://getbootstrap.com/docs/5.3/layout/grid/)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-04-14  
**Maintained By:** Development Team
