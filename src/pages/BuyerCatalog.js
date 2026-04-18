import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts, searchProducts } from "../services/productService";
import { createOrder } from "../services/orderService";
import { getToken } from "../utils/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ToastMessage from "../components/ToastMessage";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../services/categoryService";

function BuyerCatalog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [draftSearchTerm, setDraftSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [ordering, setOrdering] = useState(false);

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";

  // sync input with URL
  useEffect(() => {
    setDraftSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    const loadCatalog = async () => {
      setLoading(true);
      setError("");

      try {
        //  Get products
        const list = searchTerm.trim()
          ? await searchProducts(searchTerm.trim())
          : await getProducts();

        setProducts(list);

        //  FIXED: Get categories from API (NOT from products)
        const cats = await getCategories();

        // categories API returns [{id, name}]
        setCategories(cats);

      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load catalog."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [navigate, searchTerm]);

  // filter by category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;

    return products.filter(
      (p) => p.category === selectedCategory
    );
  }, [products, selectedCategory]);

  // update URL params
  const updateFilters = (nextSearch, nextCategory) => {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextCategory) {
      params.set("category", nextCategory);
    }

    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters(draftSearchTerm, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    updateFilters(draftSearchTerm, category);
  };

  // ================= ORDER  HANDLER =================
  const handleOrderNow = async (productId) => {
    setOrdering(true);
    setOrderError("");
    setOrderSuccess("");

    try {
      await createOrder({
        items: [{ productId, quantity: 1 }],
      });
      setOrderSuccess("✅ Order placed successfully!");
      setTimeout(() => setOrderSuccess(""), 3000);
      navigate("/buyer/orders");
    } catch (err) {
      setOrderError(err.message || "Failed to place order");
      setTimeout(() => setOrderError(""), 4000);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="container mt-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Browse Products</h2>
          <p className="text-muted">
            Search, filter and explore marketplace products
          </p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/buyer/orders")}
        >
          My Orders
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search products..."
            value={draftSearchTerm}
            onChange={(e) => setDraftSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>

            {/* FIXED CATEGORY DROPDOWN */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 d-grid">
          <button className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {/* STATES */}
      {error && <ToastMessage variant="error" message={error} onClose={() => setError("")} />}
      {orderError && <ToastMessage variant="error" message={orderError} onClose={() => setOrderError("")} />}
      {orderSuccess && <ToastMessage variant="success" message={orderSuccess} onClose={() => setOrderSuccess("")} />}

      {loading && <LoadingSkeleton count={3} />}

      {/* PRODUCTS */}
      {!loading && filteredProducts.length > 0 && (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-xl-4">
              <ProductCard
                product={product}
                onView={(id) => navigate(`/buyer/product/${id}`)}
                onAddToCart={() => handleOrderNow(product.id)}
                disabled={ordering}
              />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredProducts.length === 0 && (
        <div className="alert alert-secondary mt-4">
          No products found. Try another search or category.
        </div>
      )}
    </div>
  );
}

export default BuyerCatalog;
