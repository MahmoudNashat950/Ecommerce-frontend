import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flagBuyer } from "../services/flagService";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function FlagBuyer() {
  const [buyerId, setBuyerId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const result = await flagBuyer(buyerId, reason);
      setMessage(result?.message || "Buyer flagged successfully.");
      setBuyerId("");
      setReason("");
    } catch (err) {
      let errorMsg = err.message || "Unable to flag buyer.";
      if (err.status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else if (err.status === 403) {
        errorMsg = "Unauthorized: You must have Seller role to flag buyers.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2>Flag Buyer</h2>
        <p className="text-muted">Report buyer issues or suspicious behavior.</p>

        {loading && <LoadingSpinner message="Submitting flag..." />}
        {error && <AlertMessage type="danger">{error}</AlertMessage>}
        {message && <AlertMessage type="success">{message}</AlertMessage>}

        <div className="mb-3">
          <label className="form-label">Buyer ID</label>
          <input
            className="form-control"
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            placeholder="Enter buyer id"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea
            className="form-control"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue"
          />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}>
            Submit Flag
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/seller/dashboard")}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default FlagBuyer;
