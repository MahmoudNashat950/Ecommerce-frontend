import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromoCarousel from "../components/PromoCarousel";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";
import { getProducts } from "../services/productService";

const categories = [
  { name: "Electronics", icon: "🔌" },
  { name: "Fashion", icon: "👗" },
  { name: "Home", icon: "🏠" },
  { name: "Beauty", icon: "💄" },
  { name: "Sports", icon: "🏀" },
  { name: "Toys", icon: "🧸" },
];

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getProducts();
        setProducts(result.slice(0, 6));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="home-page">
      <PromoCarousel />

      <section className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Shop by category</h3>
            <p className="text-muted mb-0">Browse popular categories and discover what's trending.</p>
          </div>
          <Link to="/buyer/catalog" className="text-primary">View all categories →</Link>
        </div>

        <div className="row g-3">
          {categories.map((category) => (
            <div key={category.id} className="col-6 col-sm-4 col-md-2">
              <CategoryCard
                category={{
                  name: category.name,
                  icon: "📦",
                }}
                onClick={(name) =>
                  navigate(`/buyer/catalog?category=${name}`)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Featured deals</h3>
            <p className="text-muted mb-0">Handpicked products with great discounts.</p>
          </div>
          <Link to="/buyer/catalog" className="text-primary">Browse all products →</Link>
        </div>

        {loading && <LoadingSpinner message="Loading featured products..." />}
        {error && <AlertMessage type="danger">{error}</AlertMessage>}

        <div className="row g-3">
          {products.map((product) => (
            <div key={product.id} className="col-12 col-md-6 col-xl-4">
              <ProductCard
                product={product}
                onView={(id) => navigate(`/buyer/product/${id}`)}
                onAddToCart={() => alert("Added to cart")}
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
