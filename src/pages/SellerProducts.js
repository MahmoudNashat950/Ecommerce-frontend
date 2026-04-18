import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";

import { getCategories } from "../services/categoryService";
import { getToken } from "../utils/auth";

import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function SellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deliveryTimeInDays, setDeliveryTimeInDays] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    await Promise.all([fetchProducts(), fetchCategories()]);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getProducts();
      setProducts(result || []);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Unable to load categories.");
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setDeliveryTimeInDays("");
    setDiscount("");
    setImageUrl("");
  };

  const handleAddProduct = async () => {
    setError("");
    setSuccess("");

    if (!name || !price || !stock || !categoryId || !deliveryTimeInDays) {
      setError("All required fields must be filled.");
      return;
    }

    setAdding(true);

    try {
      await createProduct({
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        deliveryTimeInDays: Number(deliveryTimeInDays),
        discount: discount ? Number(discount) : 0,
        imageUrl: imageUrl.trim() || null,
      });

      setSuccess("Product created successfully.");
      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Unable to create product.");
    } finally {
      setAdding(false);
    }
  };

  // ✅ DELETE FIX
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Seller Products</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/seller/dashboard")}>
          Back
        </button>
      </div>

      {/* STATES */}
      {loading && <LoadingSpinner message="Loading products..." />}
      {error && <AlertMessage type="danger">{error}</AlertMessage>}
      {success && <AlertMessage type="success">{success}</AlertMessage>}

      {/* FORM */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <h5>Add Product</h5>

          <div className="row g-3">

            <div className="col-md-4">
              <input className="form-control" placeholder="Name"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="col-md-2">
              <input className="form-control" type="number"
                placeholder="Price"
                value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div className="col-md-2">
              <input className="form-control" type="number"
                placeholder="Stock"
                value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>

            <div className="col-md-4">
              <select className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <input className="form-control" type="number"
                placeholder="Delivery"
                value={deliveryTimeInDays}
                onChange={(e) => setDeliveryTimeInDays(e.target.value)} />
            </div>

            <div className="col-md-3">
              <input className="form-control" type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)} />
            </div>

            <div className="col-md-6">
              <input className="form-control"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)} />
            </div>

          </div>

          <button
            className="btn btn-success mt-3"
            onClick={handleAddProduct}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add Product"}
          </button>

        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="row">

        {!loading && products.length === 0 && (
          <div className="alert alert-secondary">No products found.</div>
        )}

        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">

                <h5>{p.name}</h5>
                <p>${Number(p.price || 0).toFixed(2)}</p>
                <p className="text-muted">Stock: {p.stock}</p>
                <p className="text-muted">{p.category || "Uncategorized"}</p>

                {/* ✅ EDIT / DELETE BUTTONS */}
                <div className="d-flex gap-2 mt-3">

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => navigate(`/seller/edit/${p.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default SellerProducts;