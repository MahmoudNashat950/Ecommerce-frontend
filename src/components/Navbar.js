import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole, getToken } from "../utils/auth";
import SearchInput from "./SearchInput";
import { getCategories } from "../services/categoryService";

function Navbar() {
    const navigate = useNavigate();

    const token = getToken();
    const role = getUserRole();

    const [query, setQuery] = useState("");
    const [categories, setCategories] = useState([]);

    // ================= FETCH CATEGORIES =================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.log("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    // ================= SEARCH =================
    const handleSearch = (e) => {
        e.preventDefault();

        const trimmed = query.trim();
        if (!trimmed) return;

        navigate(`/buyer/catalog?search=${encodeURIComponent(trimmed)}`);
    };

    // ================= CATEGORY CLICK =================
    const handleCategory = (categoryName) => {
        navigate(`/buyer/catalog?category=${encodeURIComponent(categoryName)}`);
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
            <div className="container">

                {/* BRAND */}
                <Link className="navbar-brand fw-bold text-dark" to="/">
                    Egyshop
                </Link>

                {/* SEARCH */}
                <form className="d-flex flex-fill mx-3" onSubmit={handleSearch}>
                    <SearchInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                    />
                </form>

                {/* RIGHT SIDE */}
                <div className="d-flex align-items-center gap-2">

                    {/* CATEGORY DROPDOWN */}
                    <div className="dropdown">
                        <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            Categories
                        </button>

                        <ul className="dropdown-menu">

                            {categories.length === 0 ? (
                                <li>
                                    <span className="dropdown-item text-muted">
                                        Loading...
                                    </span>
                                </li>
                            ) : (
                                categories.map((c) => (
                                    <li key={c.id}>
                                        <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => handleCategory(c.name)}
                                        >
                                            {c.name}
                                        </button>
                                    </li>
                                ))
                            )}

                        </ul>
                    </div>

                    {/* CART */}
                    {token && role === "buyer" && (
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate("/buyer/orders")}
                        >
                            🛒 Cart
                        </button>
                    )}

                    {/* AUTH */}
                    {token ? (
                        <button className="btn btn-warning" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link className="btn btn-outline-primary" to="/login">
                                Login
                            </Link>
                            <Link className="btn btn-primary" to="/register">
                                Sign up
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
