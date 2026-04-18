# Component API Reference

## 📦 Reusable Components

### **LoadingSkeletons Components**

#### `ProductCardSkeleton`
Animated skeleton for product cards.
```jsx
import { ProductCardSkeleton } from "../components/LoadingSkeletons";

<ProductCardSkeleton />
```

#### `ProductCardSkeletonGrid`
Grid of product skeleton loaders.
```jsx
<ProductCardSkeletonGrid count={8} />
```
- `count` (number) - Number of skeleton cards to show

#### `OrderCardSkeleton`
Animated skeleton for order cards.
```jsx
<OrderCardSkeleton />
```

#### `OrderCardSkeletonList`
List of order skeleton loaders.
```jsx
<OrderCardSkeletonList count={3} />
```
- `count` (number) - Number of skeleton cards to show

#### `ProductDetailsSkeleton`
Full-page skeleton for product details.
```jsx
<ProductDetailsSkeleton />
```

---

### **EmptyState Component**

Display when no data is available.

```jsx
import EmptyState from "../components/EmptyState";

<EmptyState
  icon="🛍️"
  title="No Products Found"
  subtitle="Try searching with different keywords"
  action={() => navigate("/products")}
  actionLabel="Browse Products"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | string | "📭" | Emoji or unicode icon |
| `title` | string | - | Main heading |
| `subtitle` | string | - | Secondary text |
| `action` | function | - | Button click handler |
| `actionLabel` | string | "Take Action" | Button text |

---

### **OrderStatusBadge Component**

Display order status with icon and styling.

```jsx
import OrderStatusBadge from "../components/OrderStatusBadge";

<OrderStatusBadge status="Shipped" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | string | "Pending" | Order status (Pending, Processing, Shipped, Delivered, Cancelled) |
| `variant` | string | "default" | Style variant (reserved for future use) |

**Status Styles:**
- Pending: 🕐 (bg-secondary)
- Processing: ⚙️ (bg-primary)
- Shipped: 🚚 (bg-warning)
- Delivered: ✅ (bg-success)
- Cancelled: ❌ (bg-danger)

---

### **ToastContainer Component**

Container for toast notifications.

```jsx
import { ToastContainer } from "../components/ToastContainer";

<ToastContainer toasts={toasts} onRemoveToast={removeToast} />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `toasts` | array | Array of toast objects |
| `onRemoveToast` | function | Callback to remove toast by ID |

**Toast Object:**
```javascript
{
  id: number,           // Unique ID
  variant: string,      // "success" | "error" | "warning" | "info"
  message: string,      // Toast text
  duration: number      // Milliseconds before auto-dismiss (default: 4000)
}
```

---

### **StarRating Component**

Display or select star ratings.

```jsx
import StarRating from "../components/StarRating";

// Display only
<StarRating value={4} readOnly size="md" />

// Interactive
<StarRating value={rating} onChange={setRating} size="lg" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 0 | Current rating (0-5) |
| `onChange` | function | - | Callback on star click |
| `readOnly` | boolean | false | Disable interaction |
| `size` | string | "md" | "sm", "md", or "lg" |

**Sizes:**
- `sm` - 1em
- `md` - 1.5em
- `lg` - 2em

---

## 🪝 Custom Hooks

### **useToast Hook**

Manage toast notifications.

```jsx
import useToast from "../hooks/useToast";

function MyComponent() {
  const { toasts, addToast, removeToast } = useToast();

  // Add toast
  addToast({
    variant: "success",
    message: "✅ Saved successfully!",
    duration: 3000  // Optional, defaults to 4000ms
  });

  // Remove specific toast
  removeToast(id);

  return (
    <>
      <button onClick={() => addToast(...)}>Show Toast</button>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
```

**Methods:**
| Method | Params | Returns | Description |
|--------|--------|---------|-------------|
| `addToast` | toast object | id (number) | Add new toast, returns ID |
| `removeToast` | id (number) | - | Remove toast by ID |

**Variants (Styling):**
- `"success"` - Green background, for confirmations
- `"error"` - Red background, for errors
- `"warning"` - Yellow background, for warnings
- `"info"` - Blue background, for information

---

## 📄 Updated Page Components

### **Products Page**

Changed from basic alerts to modern toast notifications.

```jsx
// Before: setSuccess/setError states
// After: useToast hook
const { toasts, addToast, removeToast } = useToast();

addToast({
  variant: "success",
  message: "✅ Order placed successfully!"
});
```

**Key Features:**
- Skeleton loading
- Toast notifications
- Empty state
- Order with redirect to /buyer/orders

---

### **ProductDetails Page**

Complete rewrite with modern layout.

```jsx
// Interactive rating
<StarRating value={ratingValue} onChange={setRatingValue} size="lg" />

// Status badge
<OrderStatusBadge status="Delivered" />

// Empty reviews
<EmptyState icon="📝" title="No Reviews Yet" />
```

**Layout:**
- Left: Product image (md-5)
- Right: Details (md-7)
- Bottom: Reviews section

---

### **BuyerOrders Page**

Production-quality order tracking.

**Features:**
- Order progress bar
- Status badge
- Progress stages (Pending → Processing → Shipped → Delivered)
- Item breakdown
- Order total

---

### **SellerOrders Page**

Seller order management with stats.

**Features:**
- Update order status
- Progress prevention (can't go backward)
- Status statistics sidebar
- Percentage breakdown
- Sticky sidebar on desktop

---

## 🎨 CSS Classes Reference

### **Layout**
```css
.product-card          /* Product card container */
.order-card            /* Order card container */
.product-details-container  /* Full-width content panel */
.empty-state           /* Empty state container */
```

### **Components**
```css
.product-card-img      /* Product image section */
.product-card-body     /* Product info section */
.product-card-actions  /* Action buttons */
.order-progress-bar    /* Status progress bar */
.order-status-badge    /* Status badge */
```

### **Utilities**
```css
.d-flex                /* Display flex */
.gap-2, .gap-3, .gap-4 /* Gap spacing */
.flex-grow-1           /* Flex grow */
.align-items-center    /* Align center */
.justify-content-between /* Justify between */
.mb-3, .mt-4, .p-4    /* Margin/padding */
.rounded-3             /* Large border radius */
.fw-bold               /* Font weight bold */
.text-muted            /* Muted text color */
.shadow-sm             /* Small shadow */
.bg-light              /* Light background */
```

---

## 🔧 Integration Examples

### **Using Toast in Components**

```jsx
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";

function MyComponent() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const handleAction = async () => {
    try {
      await someAPI();
      addToast({
        variant: "success",
        message: "✅ Action completed!"
      });
      // Optional: redirect
      setTimeout(() => navigate("/path"), 1500);
    } catch (err) {
      addToast({
        variant: "error",
        message: `❌ ${err.message}`
      });
    }
  };

  return (
    <>
      <button onClick={handleAction}>Do Something</button>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
```

### **Using EmptyState**

```jsx
{items.length === 0 ? (
  <EmptyState
    icon="📋"
    title="No Items"
    subtitle="You haven't created any items yet"
    action={() => navigate("/create")}
    actionLabel="Create Item"
  />
) : (
  <ItemsList items={items} />
)}
```

### **Using Skeleton Loading**

```jsx
import { ProductCardSkeletonGrid } from "../components/LoadingSkeletons";

function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  if (loading) {
    return <ProductCardSkeletonGrid count={8} />;
  }

  return (
    <div className="row g-4">
      {products.map(p => (
        <div key={p.id} className="col-lg-3 col-md-4">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Best Practices

1. **Always use ToastContainer at page level** (not component level)
2. **Combine hooks with context for shared state** across multiple components
3. **Use skeletons instead of spinners** for better perceived performance
4. **Validate data before rendering** to handle null/undefined
5. **Disable buttons during async operations**
6. **Provide meaningful empty states** instead of blank screens
7. **Use semantic HTML** for accessibility

---

## 📱 Responsive Behavior

All components are fully responsive:
- **Mobile**: Full-width, stacked layout
- **Tablet**: 2-column grid
- **Desktop**: 4-column grid or multi-section layout

Cards automatically adjust padding and font sizes based on screen size.

---

**Last Updated:** 2026-04-14
**Version:** 1.0.0 - Production Ready
