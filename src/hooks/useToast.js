import { useState, useCallback } from "react";

/**
 * useToast Hook
 * Manages toast notifications in the application
 *
 * Usage:
 * const { toasts, addToast, removeToast } = useToast();
 *
 * addToast({
 *   variant: "success", // success, error, warning, info
 *   message: "Operation successful!"
 * });
 */
function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...toast, id }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
}

export default useToast;
