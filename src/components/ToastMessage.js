import React from "react";

function ToastMessage({ variant = "info", message = "", onClose }) {
    return (
        <div className={`toast-message ${variant}`}>
            <div className="d-flex align-items-start justify-content-between gap-3">
                <div>{message}</div>
                {onClose && (
                    <button
                        type="button"
                        className="btn-close btn-close-white p-0"
                        aria-label="Close"
                        onClick={onClose}
                    />
                )}
            </div>
        </div>
    );
}

export default ToastMessage;
