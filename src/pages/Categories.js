import { useEffect, useState } from "react";
import { createCategory, getCategories } from "../services/categoryService";
import CategoryCard from "../components/CategoryCard";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || "Failed to load categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async () => {
        setError("");
        setSuccess("");

        if (!name) {
            setError("Category name required");
            return;
        }

        try {
            await createCategory(name);
            setSuccess("Category added");

            setName("");
            fetchCategories();
        } catch (err) {
            setError(err.message || "Failed to add category");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Category Management</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="d-flex mb-3">
                <input
                    className="form-control me-2"
                    placeholder="New category"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addCategory}>
                    Add
                </button>
            </div>

            <ul className="list-group">
                {categories.map((c) => (
                    <li key={c.id} className="list-group-item">
                        {c.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;
