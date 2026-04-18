import React, { useState } from "react";

/**
 * Reusable OrderCard component for displaying order details
 * Can be used by both buyer and seller pages
 *
 * @param {Object} order - Order object with id, status, items, totalPrice, createdAt
 * @param {Array} order.items - Items in the order
 * @param {string} order.status - Order status (Pending, Processing, Shipped, Delivered)
 * @param {number} order.totalPrice - Total price of the order
 * @param {string} order.createdAt - ISO date string
 * @param {Function} onStatusChange - Callback for status change (seller only)
 * @param {Function} onAddComment - Callback for adding comment
 * @param {boolean} isSeller - Whether this is viewed as seller (shows status dropdown)
 */
function OrderCard({
    order,
    onStatusChange,
    onAddComment,
    isSeller = false,
}) {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { id, status, items, totalPrice, createdAt } = order || {};

    // ========== STATUS BADGE STYLING ==========
    const getStatusBadgeClass = (statusValue) => {
        switch (statusValue?.toLowerCase()) {
            case "pending":
                return "bg-secondary";
            case "processing":
                return "bg-primary";
            case "shipped":
                return "bg-warning text-dark";
            case "delivered":
                return "bg-success";
            default:
                return "bg-secondary";
        }
    };

    // ========== STATUS PROGRESSION ==========
    const statusProgression = [\"Pending\", \"Processing\", \"Shipped\", \"Delivered\", \"Cancelled\"];
    const currentStatusIndex = statusProgression.indexOf(status);

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            alert("Please enter a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            await onAddComment?.(id, commentText);
            setCommentText("");
            setShowCommentInput(false);
        } catch (err) {
            alert(err.message || "Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card mb-3 shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="card-body">
                {/* HEADER: Order ID + Status */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Order #{id}</h5>
                    <span className={`badge ${getStatusBadgeClass(status)} p-2`}>
                        {status}
                    </span>
                </div>

                {/* DATE */}
                <p className="text-muted small mb-3">
                    {createdAt
                        ? new Date(createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "No date"}
                </p>

                {/* STATUS PROGRESSION BAR */}
                <div className="mb-3">
                    <div className="progress" style={{ height: "6px" }}>
                        <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{
                                width: `${((currentStatusIndex + 1) / statusProgression.length) * 100}%`,
                            }}
                            aria-valuenow={currentStatusIndex + 1}
                            aria-valuemin="0"
                            aria-valuemax={statusProgression.length}
                        ></div>
                    </div>
                    <small className="text-muted d-flex justify-content-between mt-1">
                        <span>Pending</span>
                        <span>Delivered</span>
                    </small>
                </div>

                {/* ITEMS LIST */}
                <div className="mb-3">
                    <p className="small fw-bold text-muted mb-2">Items:</p>
                    <ul className="list-unstyled ms-3">
                        {items?.map((item, idx) => (
                            <li key={idx} className="small mb-1">
                                <strong>{item.productName}</strong> × {item.quantity} @{" "}
                                ${item.price?.toFixed(2) || "0.00"}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DIVIDER */}
                <hr className="my-2" />

                {/* TOTAL PRICE */}
                <p className="fw-bold mb-3">
                    Total: <span className="text-success">${totalPrice?.toFixed(2) || "0.00"}</span>
                </p>

                {/* ========== SELLER: STATUS DROPDOWN ========== */}
                {isSeller && (
                    <div className="mb-3">
                        <label className="form-label fw-5 mb-2">Update Status</label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => onStatusChange?.(id, e.target.value)}
                            disabled={false}
                        >
                            {statusProgression.map((s) => (
                                <option
                                    key={s}
                                    value={s}
                                    disabled={statusProgression.indexOf(s) < currentStatusIndex}
                                >
                                    {s} {statusProgression.indexOf(s) < currentStatusIndex ? "(Cannot revert)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ========== BUYER: ADD COMMENT ========== */}
                {!isSeller && (
                    <div>
                        {!showCommentInput ? (
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setShowCommentInput(true)}
                            >
                                💬 Add Comment
                            </button>
                        ) : (
                            <div className="alert alert-light p-2">
                                <textarea
                                    className="form-control form-control-sm mb-2"
                                    placeholder="Add a comment (e.g., 'Please deliver after 5 PM')"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    rows="3"
                                    disabled={isSubmitting}
                                />
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleAddComment}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Send"}
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => {
                                            setShowCommentInput(false);
                                            setCommentText("");
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderCard;
