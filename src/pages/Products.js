import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, searchProducts } from "../services/productService";
import { createOrder } from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeletonGrid } from "../components/LoadingSkeletons";
import EmptyState from "../components/EmptyState";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";

/**
 * Products Page (Buyer)
 * Display available products with search functionality and order capability
 */
function Products() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState(null);

  // ========== AUTH CHECK ==========
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // ========== LOAD PRODUCTS ==========
  const loadProducts = async (keyword = "") => {
    setLoading(true);

    try {
      const result = keyword.trim()
        ? await searchProducts(keyword.trim())
        : await getProducts();

      setProducts(Array.isArray(result) ? result : []);
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Unable to load products.",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== INITIAL LOAD ==========
  useEffect(() => {
    loadProducts();
  }, []);

  // ========== SEARCH HANDLER ==========
  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(searchTerm);
  };

  // ========== PLACE ORDER HANDLER ==========
  const handlePlaceOrder = async (productId) => {
    setOrderingId(productId);

    try {
      await createOrder({
        items: [
          {
            productId: productId,
            quantity: 1,
          },
        ],
      });

      addToast({
        variant: "success",
        message: "✅ Order placed successfully! Redirecting to your orders...",
      });

      // Redirect to orders page after 1.5 seconds
      setTimeout(() => {
        navigate("/buyer/orders");
      }, 1500);
    } catch (err) {
      addToast({
        variant: "error",
        message: `❌ ${err.message || "Order failed"}`,
      });
    } finally {
      setOrderingId(null);
    }
  };

  // ========== HANDLE VIEW PRODUCT ==========
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="fw-bold mb-4">Products</h2>
        <ProductCardSkeletonGrid count={8} />
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold mb-3">Shop Products</h2>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              🔍 Search
            </button>
          </div>
        </form>
      </div>

      {/* PRODUCTS GRID */}
      {products.length === 0 ? (
        <EmptyState
          icon="🛍️"
          title="No Products Found"
          subtitle={
            searchTerm
              ? `No products match "${searchTerm}". Try a different search term.`
              : "No products available at the moment."
          }
          action={searchTerm ? () => { setSearchTerm(""); loadProducts(); } : undefined}
          actionLabel={searchTerm ? "Clear Search" : undefined}
        />
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard
                product={product}
                onView={handleViewProduct}
                onAddToCart={handlePlaceOrder}
                disabled={orderingId === product.id}
              />
            </div>
          ))}
        </div>
      )}

      {/* TOAST CONTAINER */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default Products;