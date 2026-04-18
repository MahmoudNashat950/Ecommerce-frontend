import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, addOrderComment } from "../services/orderService";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Buyer Orders Page
 * Display all orders placed by the current user with status tracking and comment functionality
 */
function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // ========== LOAD ORDERS ON MOUNT ==========
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchOrders();
    }, [navigate]);

    // ========== FETCH BUYER ORDERS ==========
    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await getMyOrders();
            // Ensure data is always an array
            const orderList = Array.isArray(data) ? data : [];
            // Filter out null/undefined orders
            const validOrders = orderList.filter(order => order && order.id);
            setOrders(validOrders);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "Unable to load orders.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // ========== ADD COMMENT TO ORDER ==========
    const handleAddComment = async (orderId, commentText) => {
        setError("");
        setSuccess("");

        try {
            await addOrderComment(orderId, commentText);
            setSuccess("Comment added successfully!");

            // Refresh orders after adding comment
            setTimeout(() => {
                fetchOrders();
                setSuccess("");
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to add comment.");
        }
    };

    return (
        <div className="container mt-4">
            {/* HEADER */}
            <div className="mb-4">
                <h2 className="fw-bold mb-2">My Orders</h2>
                <p className="text-muted">Track your orders and manage comments</p>
            </div>

            {/* ALERTS */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    ❌ {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    ></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    ✅ {success}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess("")}
                    ></button>
                </div>
            )}

            {/* LOADING */}
            {loading && <LoadingSpinner message="Loading your orders..." />}

            {/* EMPTY STATE */}
            {!loading && orders.length === 0 && (
                <div className="text-center py-5">
                    <div className="display-1 mb-3">📦</div>
                    <h4 className="text-muted">No Orders Yet</h4>
                    <p className="text-muted">
                        You haven't placed any orders. Start shopping now!
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/buyer/products")}
                    >
                        Continue Shopping
                    </button>
                </div>
            )}

            {/* ORDERS LIST */}
            {!loading && orders.length > 0 && (
                <div className="row">
                    {orders.map((order) => (
                        <div className="col-lg-6 mb-4" key={order.id}>
                            <OrderCard
                                order={order}
                                onAddComment={handleAddComment}
                                isSeller={false}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* REFRESH BUTTON */}
            {!loading && orders.length > 0 && (
                <div className="text-center mt-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={fetchOrders}
                    >
                        🔄 Refresh Orders
                    </button>
                </div>
            )}
        </div>
    );
}

export default Orders;
