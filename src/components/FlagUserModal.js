import { useEffect, useState } from "react";

const formatLabel = (value, fallback = "Unknown") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function FlagUserModal({
  user,
  isOpen,
  loading,
  onClose,
  onSubmit,
  title = "Flag User",
  kicker = "Moderation Action",
  description,
  submitLabel = "Submit Flag",
  showUserId = true,
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const userName = user?.name || user?.email || "this user";
  const userRole = formatLabel(user?.role, "User");
  const modalCopy =
    description ||
    `Submit a moderation flag for ${userName} (${userRole}).`;

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setError("");
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen || !user) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError("Reason is required.");
      return;
    }

    setError("");
    await onSubmit?.(trimmedReason);
  };

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="admin-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="flag-user-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-kicker mb-2">{kicker}</p>
            <h3 id="flag-user-modal-title" className="admin-modal-title">
              {title}
            </h3>
            <p className="admin-modal-copy">{modalCopy}</p>
          </div>

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
            disabled={loading}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-user-context">
            {showUserId ? (
              <div className="admin-detail-item">
                <p className="admin-detail-label">User ID</p>
                <p className="admin-detail-value">{user?.id ?? user?.userId ?? user?._id ?? "N/A"}</p>
              </div>
            ) : null}
            <div className="admin-detail-item">
              <p className="admin-detail-label">Role</p>
              <p className="admin-detail-value">{userRole}</p>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="flag-user-reason" className="form-label fw-semibold">
              Reason
            </label>
            <textarea
              id="flag-user-reason"
              className="form-control admin-modal-textarea"
              rows="4"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this user should be flagged"
              disabled={loading}
            />
          </div>

          {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}

          <div className="admin-modal-actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-outline-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FlagUserModal;
