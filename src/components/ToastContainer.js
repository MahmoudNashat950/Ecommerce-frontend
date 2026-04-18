import React, { useEffect, useState } from "react";

/**
 * Toast Component
 * Individual toast notification
 */
function Toast({ id, variant = "info", message, onClose, duration = 4000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose?.(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const variantStyles = {
        success: "bg-success text-white",
        error: "bg-danger text-white",
        warning: "bg-warning text-dark",
        info: "bg-info text-white",
    };

    return (
        <div
            className={`toast show ${variantStyles[variant]}`}
            role="alert"
            style={{
                minWidth: "300px",
                wordWrap: "break-word",
            }}
        >
            <div className="toast-body">
                <div className="d-flex justify-content-between align-items-center">
                    <span>{message}</span>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => onClose?.(id)}
                        aria-label="Close"
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * ToastContainer Component
 * Manages and displays multiple toasts
 */
function ToastContainer({ toasts = [], onRemoveToast }) {
    if (toasts.length === 0) return null;

    return (
        <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 9999 }}
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={onRemoveToast}
                />
            ))}
        </div>
    );
}

export { Toast, ToastContainer };
export default ToastContainer;
