import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerOrders, updateOrderStatus, getOrderComments } from "../services/orderService";
import { getToken } from "../utils/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import OrderStatusBadge from "../components/OrderStatusBadge";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast"

function SellerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderComments, setOrderComments] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const result = await getSellerOrders();
        const orderList = Array.isArray(result) ? result : [];
        // Filter out cancelled orders
        const validOrders = orderList.filter(order => order && order.id && order.status?.toLowerCase() !== "cancelled");
        setOrders(validOrders);
        validOrders.forEach(order => loadOrderComments(order.id));
      } catch (err) {
        let message = err.message || "Unable to load seller orders.";
        if (err.status === 401) {
          message = "Session expired. Please log in again.";
        } else if (err.status === 403) {
          message = "Unauthorized: You must have Seller role to view orders.";
        }
        addToast({ variant: "error", message });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate, addToast]);

  const statusProgression = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  const loadOrderComments = async (orderId) => {
    try {
      const comments = await getOrderComments(orderId);
      setOrderComments(prev => ({ ...prev, [orderId]: comments }));
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addToast({
        variant: "success",
        message: `✅ Order #${orderId} updated to ${newStatus}`,
      });
      const result = await getSellerOrders();
      setOrders(Array.isArray(result) ? result : []);
      result.forEach(order => loadOrderComments(order.id));
    } catch (err) {
      let message = err.message || "Unable to update order status.";
      if (err.status === 401) {
        message = "Session expired. Please log in again.";
      } else if (err.status === 403) {
        message = "Unauthorized: You must have Seller role with product ownership to update status.";
      }
      addToast({ variant: "error", message });
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Seller Dashboard</h2>
          <p className="text-muted">Manage incoming orders and track status.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/seller/products")}>📦 Manage Products</button>
      </div>

      {loading && <LoadingSpinner message="Loading seller orders..." />}

      {orders.length === 0 && !loading && (
        <div className="alert alert-secondary text-center py-5">
          <h5>No seller orders yet</h5>
          <p>Orders will appear here as buyers place them</p>
        </div>
      )}

      <div className="row g-4">
        {orders.map((order) => (
          <div key={order.id} className="col-lg-6">
            <div className="card shadow-sm h-100 border-0 rounded-3">
              <div className="p-3 d-flex justify-content-between align-items-start" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                <div>
                  <h5 className="mb-1">Order #{order.id}</h5>
                  <p className="text-muted small mb-0">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <OrderStatusBadge status={order.status || "Pending"} />
              </div>
              <div className="card-body">
                <div className="mb-3 pb-3 border-bottom">
                  <p className="mb-1"><strong>Buyer:</strong> {order.buyerName || "Unknown"}</p>
                </div>
                <div className="mb-3 pb-3 border-bottom">
                  <p className="small fw-bold text-muted mb-2">Items:</p>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <ul className="list-unstyled ms-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="small mb-1"><strong>{item.productName}</strong> x {item.quantity} @ ${Number(item.price).toFixed(2)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted small">No items</p>
                  )}
                </div>
                <div className="mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between"><strong>Total:</strong><span className="text-success fw-bold">${Number(order.totalPrice || 0).toFixed(2)}</span></div>
                </div>
                {orderComments[order.id]?.length > 0 && (
                  <div className="mb-3 pb-3 border-bottom">
                    <p className="small fw-bold text-muted mb-2">💬 Buyer Comments:</p>
                    {orderComments[order.id].map((comment, idx) => (
                      <div key={idx} className="card bg-light p-2 mb-2 small">
                        <p className="mb-1">{comment.text || comment}</p>
                        <small className="text-muted">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}</small>
                      </div>
                    ))}
                  </div>
                )}
                <div><label className="form-label small fw-bold mb-2">Update Status:</label><div className="btn-group w-100" role="group">{statusProgression.map((status) => (<button key={status} className={`btn btn-sm ${order.status === status ? "btn-primary active" : "btn-outline-primary"}`} onClick={() => handleStatusChange(order.id, status)}>{status}</button>))}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default SellerDashboard;
