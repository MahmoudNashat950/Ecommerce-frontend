import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Seller");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const result = await register(name, email, password, role);

            setSuccess(result?.message || "Registration successful. Please log in.");
            setName("");
            setEmail("");
            setPassword("");
            window.location.href = "/login";
        } catch (err) {
            setError(
                err.message ||
                "Network error: unable to connect to backend. Verify http://localhost:5269 and your backend/CORS configuration."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title mb-4">Register</h2>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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

                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Seller">Seller</option>
                            <option value="Buyer">Buyer</option>

                        </select>
                    </div>

                    <button
                        className="btn btn-success w-100"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
