import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flagSeller } from "../services/flagService";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function FlagSeller() {
  const [sellerId, setSellerId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await flagSeller(sellerId, reason);
      setMessage(result?.message || "Seller flagged successfully.");
      setSellerId("");
      setReason("");
    } catch (err) {
      let errorMsg = err.message || "Unable to flag seller.";
      if (err.status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else if (err.status === 403) {
        errorMsg = "Unauthorized: You must have Buyer role to flag sellers.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2>Flag Seller</h2>
        <p className="text-muted">Report seller issues to the marketplace team.</p>

        {loading && <LoadingSpinner message="Submitting flag..." />}
        {error && <AlertMessage type="danger">{error}</AlertMessage>}
        {message && <AlertMessage type="success">{message}</AlertMessage>}

        <div className="mb-3">
          <label className="form-label">Seller ID</label>
          <input
            className="form-control"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="Enter seller id"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea
            className="form-control"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the issue"
          />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}>
            Submit Flag
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/buyer/catalog")}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default FlagSeller;
