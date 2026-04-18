import React from "react";

/**
 * EmptyState Component
 * Generic empty state UI with customizable icon, title, and call-to-action
 */
function EmptyState({ icon = "📭", title, subtitle, action, actionLabel = "Take Action" }) {
    return (
        <div className="empty-state text-center py-5">
            <div className="empty-state-icon mb-3" style={{ fontSize: "64px" }}>
                {icon}
            </div>
            <h4 className="text-muted mb-2">{title}</h4>
            {subtitle && <p className="text-muted small mb-4">{subtitle}</p>}
            {action && (
                <button className="btn btn-primary" onClick={action}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
