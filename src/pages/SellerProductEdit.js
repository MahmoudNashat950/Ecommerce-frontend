import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProducts,
    updateProduct
} from "../services/productService";

import { getCategories } from "../services/categoryService";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function SellerProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        deliveryTimeInDays: "",
        discount: "",
        imageUrl: ""
    });

    // ================= LOAD PRODUCT =================
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const products = await getProducts();
                const product = products.find(p => String(p.id) === String(id));

                if (!product) {
                    setError("Product not found");
                    return;
                }

                setForm({
                    name: product.name || "",
                    price: product.price || "",
                    stock: product.stock || "",
                    categoryId: product.categoryId || "",
                    deliveryTimeInDays: product.deliveryTimeInDays || "",
                    discount: product.discount || "",
                    imageUrl: product.imageUrl || ""
                });

                const cats = await getCategories();
                setCategories(cats || []);

            } catch (err) {
                setError(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= SAVE =================
    const handleSave = async () => {
        setError("");
        setSuccess("");

        if (!form.name || !form.price || !form.stock || !form.categoryId) {
            setError("Please fill required fields");
            return;
        }

        setSaving(true);

        try {
            await updateProduct(id, {
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                categoryId: Number(form.categoryId),
                deliveryTimeInDays: Number(form.deliveryTimeInDays),
                discount: form.discount ? Number(form.discount) : 0,
                imageUrl: form.imageUrl || null
            });

            setSuccess("Product updated successfully");

            setTimeout(() => {
                navigate("../products");
            }, 1000);

        } catch (err) {
            setError(err.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading product..." />;

    return (
        <div className="container mt-4">

            <h2>Edit Product</h2>

            {error && <AlertMessage type="danger">{error}</AlertMessage>}
            {success && <AlertMessage type="success">{success}</AlertMessage>}

            <div className="card p-3 shadow-sm">

                <div className="row g-3">

                    <div className="col-md-4">
                        <input
                            className="form-control"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            className="form-control"
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            className="form-control"
                            name="stock"
                            type="number"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <select
                            className="form-select"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <input
                            className="form-control"
                            name="deliveryTimeInDays"
                            type="number"
                            placeholder="Delivery Days"
                            value={form.deliveryTimeInDays}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            className="form-control"
                            name="discount"
                            type="number"
                            placeholder="Discount"
                            value={form.discount}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <input
                            className="form-control"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={form.imageUrl}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="mt-3 d-flex gap-2">

                    <button
                        className="btn btn-success"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("../products")}
                    >
                        Cancel
                    </button>

                </div>

            </div>
        </div>
    );
}

export default SellerProductEdit;