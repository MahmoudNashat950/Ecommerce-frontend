import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerOrders,
  updateOrderStatus,
  getOrderComments
} from "../services/orderService";
import { OrderCardSkeletonList } from "../components/LoadingSkeletons";
import EmptyState from "../components/EmptyState";
import OrderStatusBadge from "../components/OrderStatusBadge";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const [orderComments, setOrderComments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const loadOrderComments = async (orderId) => {
    try {
      const comments = await getOrderComments(orderId);
      setOrderComments(prev => ({ ...prev, [orderId]: comments }));
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getSellerOrders();
      const orderList = Array.isArray(data) ? data : [];
      // Filter out cancelled orders
      const validOrders = orderList.filter(order => order && order.id && order.status?.toLowerCase() !== "cancelled");
      setOrders(validOrders);
      // Load comments for each order
      validOrders.forEach(order => loadOrderComments(order.id));
    } catch (err) {
      console.error(err);
      let message = err.message || "Unable to load seller orders.";
      if (err.status === 401) {
        message = "Session expired. Please log in again.";
      } else if (err.status === 403) {
        message = "Unauthorized: You must have Seller role to view seller orders.";
      }
      addToast({
        variant: "error",
        message,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      addToast({
        variant: "success",
        message: `✅ Order #${orderId} updated to ${newStatus}`,
      });
      setTimeout(fetchOrders, 1000);
    } catch (err) {
      let message = err.message || "Failed to update order status.";
      if (err.status === 401) {
        message = "Session expired. Please log in again.";
      } else if (err.status === 403) {
        message = "Unauthorized: You must have Seller role to update orders.";
      }
      addToast({
        variant: "error",
        message,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="fw-bold mb-4">Seller Orders</h2>
        <OrderCardSkeletonList count={3} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-4">
        <EmptyState
          icon="📭"
          title="No Orders Yet"
          subtitle="Orders will appear here."
        />
      </div>
    );
  }

  const statusProgression = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  const getProgressPercentage = (status) => {
    const index = statusProgression.indexOf(status);
    return index >= 0 ? ((index + 1) / statusProgression.length) * 100 : 0;
  };

  const statuses = {
    Pending: orders.filter(o => o.status?.toLowerCase() === "pending").length,
    Processing: orders.filter(o => o.status?.toLowerCase() === "processing").length,
    Shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
    Delivered: orders.filter(o => o.status?.toLowerCase() === "delivered").length,
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Seller Orders Management</h2>
        <p className="text-muted">Total: {orders.length}</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {orders.map(order => {
            const progress = getProgressPercentage(order.status || "Pending");

            return (
              <div key={order.id} className="card mb-4">
                <div className="p-3 d-flex justify-content-between">
                  <div>
                    <h5>Order #{order.id}</h5>
                    <p className="text-muted small mb-0">
                      Buyer: {order.buyerName} | Created: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status || "Pending"} />
                </div>

                <div className="p-3">
                  <div className="mb-3">
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <ul className="list-unstyled">
                    {order.items?.map((item, i) => (
                      <li key={i} className="mb-2 d-flex justify-content-between">
                        <span>{item.productName} (x{item.quantity})</span>
                        <span>${item.price}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3">
                    {statusProgression.map(status => (
                      <button
                        key={status}
                        className="btn btn-sm btn-outline-primary me-2"
                        disabled={updating}
                        onClick={() => handleStatusChange(order.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 fw-bold">
                    Total: ${order.totalPrice}
                  </div>

                  {/* Buyer Comments */}
                  {orderComments[order.id]?.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="text-muted small mb-2">💬 Buyer Comments</h6>
                      {orderComments[order.id].map((comment, idx) => (
                        <div key={idx} className="card bg-light p-2 mb-2 small">
                          <p className="mb-1">{comment.text || comment}</p>
                          <small className="text-muted">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="card p-3">
            <h6>Order Stats</h6>
            {Object.entries(statuses).map(([s, c]) => (
              <p key={s}>{s}: {c}</p>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED REFRESH BUTTON */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={fetchOrders}
          disabled={updating}
        >
          🔄 Refresh Orders
        </button>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default SellerOrders;