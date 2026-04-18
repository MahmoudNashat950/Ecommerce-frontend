import { useEffect, useState } from "react";
import { getBuyerOrders, addOrderComment, getOrderComments } from "../services/orderService";
import { OrderCardSkeletonList } from "../components/LoadingSkeletons";
import EmptyState from "../components/EmptyState";
import OrderStatusBadge from "../components/OrderStatusBadge";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";

/**
 * Buyer Orders Page
 * Display all orders placed by the buyer with status tracking
 */
function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();
  const [commentTexts, setCommentTexts] = useState({});
  const [orderComments, setOrderComments] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrderComments = async (orderId) => {
    try {
      const comments = await getOrderComments(orderId);
      setOrderComments(prev => ({ ...prev, [orderId]: comments }));
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getBuyerOrders();
      const orderList = Array.isArray(data) ? data : [];
      // Filter out cancelled orders
      const validOrders = orderList.filter(o => o && o.id && o.status?.toLowerCase() !== "cancelled");
      setOrders(validOrders);
      // Load comments for each order
      validOrders.forEach(order => loadOrderComments(order.id));
    } catch (err) {
      console.error("Error loading orders:", err);
      let message = err.message || "Failed to load orders";
      if (err.status === 401) {
        message = "Session expired. Please log in again.";
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

  const handleAddComment = async (orderId, text) => {
    if (!text || !text.trim()) {
      addToast({ variant: "warning", message: "Please enter a comment." });
      return;
    }
    try {
      await addOrderComment(orderId, text.trim());
      addToast({ variant: "success", message: "Comment added successfully." });
      setCommentTexts(prev => ({ ...prev, [orderId]: "" }));
      // Refresh comments for this order
      await loadOrderComments(orderId);
    } catch (err) {
      let message = err.message || "Failed to add comment.";
      if (err.status === 401) {
        message = "Session expired. Please log in again.";
      } else if (err.status === 403) {
        message = "Unauthorized: You must be logged in to add comments.";
      }
      addToast({ variant: "error", message });
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="fw-bold mb-4">My Orders</h2>
        <OrderCardSkeletonList count={3} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-4">
        <EmptyState
          icon="📦"
          title="No Orders Yet"
          subtitle="You haven't placed any orders. Start shopping now!"
          action={() => window.location.href = "/products"}
          actionLabel="Browse Products"
        />
      </div>
    );
  }

  const statusProgression = ["Pending", "Processing", "Shipped", "Delivered"];

  const getProgressPercentage = (status) => {
    const index = statusProgression.indexOf(status);
    return index >= 0 ? ((index + 1) / statusProgression.length) * 100 : 0;
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      <div className="row">
        {orders.map((order) => (
          <div key={order.id} className="col-12 mb-4">
            <div className="card order-card">
              {/* Order Header */}
              <div
                className="d-flex justify-content-between align-items-center p-4"
                style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}
              >
                <div>
                  <h5 className="mb-2">Order #{order.id}</h5>
                  <p className="text-muted small mb-0">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "N/A"}
                  </p>
                </div>
                <OrderStatusBadge status={order.status || "Pending"} />
              </div>

              {/* Order Body */}
              <div className="p-4">
                {/* Status Progress */}
                <div className="mb-4">
                  <div className="order-progress-bar">
                    <div
                      className="order-progress"
                      style={{ width: `${getProgressPercentage(order.status || "Pending")}%` }}
                    />
                  </div>
                  <div className="d-flex justify-content-between small text-muted mt-2">
                    {statusProgression.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontWeight: statusProgression.indexOf(s) <= statusProgression.indexOf(order.status || "Pending") ? "600" : "400",
                          color: statusProgression.indexOf(s) <= statusProgression.indexOf(order.status || "Pending") ? "#198754" : "#ccc",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Items</h6>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <ul className="list-unstyled">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="border-bottom pb-2 mb-2">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="mb-1 fw-5">{item.productName || "Unknown Product"}</p>
                              <small className="text-muted">Quantity: {item.quantity}</small>
                            </div>
                            <div className="text-end">
                              <p className="mb-0 fw-bold">
                                ${Number(item.price || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No items in this order</p>
                  )}
                </div>

                {/* Order Total */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">Total:</h6>
                    <div className="order-total">
                      ${Number(order.totalPrice || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-3 border-top pt-3">
                  <h6 className="text-muted mb-2">Comments</h6>
                  {orderComments[order.id]?.length > 0 ? (
                    <div className="mb-3">
                      {orderComments[order.id].map((comment, idx) => (
                        <div key={idx} className="card bg-light mb-2 p-2 small">
                          <p className="mb-1">{comment.text || comment}</p>
                          <small className="text-muted">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-2">No comments yet</p>
                  )}

                  <textarea
                    className="form-control form-control-sm"
                    placeholder="Add a comment to this order"
                    rows="2"
                    value={commentTexts[order.id] || ""}
                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [order.id]: e.target.value }))}
                  />
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => handleAddComment(order.id, commentTexts[order.id])}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={loadOrders}
          disabled={loading}
        >
          🔄 Refresh Orders
        </button>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default BuyerOrders;