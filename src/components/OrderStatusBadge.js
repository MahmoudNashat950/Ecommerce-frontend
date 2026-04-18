import React from "react";

/**
 * OrderStatusBadge Component
 * Reusable badge displaying order status with appropriate styling
 */
function OrderStatusBadge({ status = "Pending", variant = "default" }) {
    const statusStyles = {
        Pending: { bg: "bg-secondary", icon: "⏳" },
        Processing: { bg: "bg-primary", icon: "⚙️" },
        Shipped: { bg: "bg-warning text-dark", icon: "🚚" },
        Delivered: { bg: "bg-success", icon: "✅" },
        Cancelled: { bg: "bg-danger", icon: "❌" },
    };

    const defaultStyle = statusStyles[status] || statusStyles.Pending;
    const { bg, icon } = defaultStyle;

    return (
        <span className={`badge ${bg} p-2 fw-5 d-inline-flex align-items-center gap-2`}>
            <span>{icon}</span>
            <span>{status}</span>
        </span>
    );
}

export default OrderStatusBadge;
