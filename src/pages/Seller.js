import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createProduct as createProductRequest,
    deleteProduct as deleteProductRequest,
    getProducts,
    updateProduct as updateProductRequest,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import {
    getSellerOrders,
    updateOrderStatus,
} from "../services/orderService";

function Seller() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [deliveryTimeInDays, setDeliveryTimeInDays] = useState("");
    const [discount, setDiscount] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [adding, setAdding] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingProduct, setEditingProduct] = useState(null);

    // ✅ FIXED AUTH CHECK
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchProducts();
        fetchOrders();
        fetchCategoriesList();
    }, [navigate]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (err) {
            setError(err.message || "Unable to load products.");
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const data = await getSellerOrders();
            setOrders(data || []);
        } catch (err) {
            setError(err.message || "Unable to load orders.");
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchCategoriesList = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (err) {
            setError(err.message || "Unable to load categories.");
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setName("");
        setPrice("");
        setStock("");
        setCategoryId("");
        setDeliveryTimeInDays("");
        setDiscount("");
        setImageUrl("");
    };

    const buildProductPayload = () => ({
        name,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        categoryId: Number(categoryId) || 0,
        deliveryTimeInDays: Number(deliveryTimeInDays) || 0,
        discount: discount === "" ? null : Number(discount),
        imageUrl: imageUrl.trim() || null,
    });

    const validateForm = () => {
        if (!name || !price || !stock || !categoryId) {
            setError("Name, price, stock, category are required.");
            return false;
        }
        return true;
    };

    const handleAddProduct = async () => {
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        setAdding(true);
        try {
            await createProductRequest(buildProductPayload());
            setSuccess("Product added successfully.");
            resetForm();
            fetchProducts();
        } catch (err) {
            setError(err.message || "Failed to add product.");
        } finally {
            setAdding(false);
        }
    };

    const handleUpdateProduct = async () => {
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        try {
            await updateProductRequest(editingProduct.id, buildProductPayload());

            setSuccess("Product updated successfully.");

            resetForm();
            setEditingProduct(null); // ✅ IMPORTANT FIX
            fetchProducts();
        } catch (err) {
            setError(err.message || "Update failed.");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await deleteProductRequest(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err.message || "Delete failed.");
        }
    };

    const handleUpdateStatus = async (orderId) => {
        try {
            await updateOrderStatus(orderId, "Shipped");
            setSuccess("Order updated.");
            fetchOrders();
        } catch (err) {
            setError(err.message || "Failed to update order.");
        }
    };

    const startEdit = (product) => {
        setEditingProduct(product);

        setName(product.name || "");
        setPrice(String(product.price ?? ""));
        setStock(String(product.stock ?? ""));
        setDeliveryTimeInDays(String(product.deliveryTimeInDays ?? ""));
        setDiscount(product.discount ?? "");
        setImageUrl(product.imageUrl || "");

        const matched = categories.find(c => c.name === product.category);
        setCategoryId(matched ? String(matched.id) : "");
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Seller Dashboard</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* FORM */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h4>{editingProduct ? "Edit Product" : "Add Product"}</h4>

                    <div className="row g-3">

                        <div className="col-md-4">
                            <input className="form-control"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="col-md-2">
                            <input className="form-control"
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)} />
                        </div>

                        <div className="col-md-2">
                            <input className="form-control"
                                type="number"
                                placeholder="Stock"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)} />
                        </div>

                        <div className="col-md-4">
                            <select className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <input className="form-control"
                                type="number"
                                placeholder="Delivery Days"
                                value={deliveryTimeInDays}
                                onChange={(e) => setDeliveryTimeInDays(e.target.value)} />
                        </div>

                        <div className="col-md-3">
                            <input className="form-control"
                                type="number"
                                placeholder="Discount"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)} />
                        </div>

                        <div className="col-md-4">
                            <input className="form-control"
                                placeholder="Image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)} />
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-success w-100"
                                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                                disabled={adding}
                            >
                                {editingProduct ? "Update" : "Add"}
                            </button>

                            {editingProduct && (
                                <button className="btn btn-secondary w-100 mt-2" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* PRODUCTS */}
            <div className="card p-3">
                <h4>My Products</h4>

                {products.map(p => (
                    <div
                        key={p.id}
                        className="border p-3 mb-2 rounded d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{p.name}</strong>
                            <div>${Number(p.price || 0).toFixed(2)}</div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-warning btn-sm" onClick={() => startEdit(p)}>
                                Edit
                            </button>

                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Seller;