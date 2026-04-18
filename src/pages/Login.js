import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            if (role === "buyer") {
                navigate("/buyer");
            } else {
                navigate("/seller");
            }
        }
    }, [navigate]);

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);
            const { token, user } = result;

            if (!token || !user) {
                throw new Error("Invalid login response");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role.toLowerCase());

            if (user.role.toLowerCase() === "buyer") {
                navigate("/buyer");
            } else {
                navigate("/seller");
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
