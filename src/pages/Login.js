import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { getToken, getUserRole, normalizeRole } from "../utils/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        const role = normalizeRole(getUserRole());

        if (token) {
            if (role === "buyer") {
                navigate("/buyer");
            } else if (role === "seller") {
                navigate("/seller");
            } else if (role === "admin") {
                navigate("/admin");
            }
        }
    }, [navigate]);

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);
            const token = result?.token;
            const nextRole = normalizeRole(result?.user?.role) || normalizeRole(getUserRole());

            if (!token) {
                throw new Error("Invalid login response");
            }

            if (nextRole === "buyer") {
                navigate("/buyer");
            } else if (nextRole === "seller") {
                navigate("/seller");
            } else if (nextRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Network error: Check backend or CORS");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "420px" }}>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title mb-4">Login</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                    <p className="mt-3 text-center">
                        Don't have an account?{" "}
                        <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
