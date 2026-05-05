import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import FlagUserModal from "../components/FlagUserModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";
import { getAdminUsers } from "../services/adminService";
import { flagBuyer } from "../services/flagService";

const getUserId = (user) => user?.id ?? user?.userId ?? user?._id ?? null;

const isBuyer = (user) =>
  String(user?.role || "").trim().toLowerCase() === "buyer";

function FlagBuyer() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const loadBuyers = async () => {
    setLoading(true);
    setError("");

    try {
      const users = await getAdminUsers();
      setBuyers(users.filter(isBuyer));
    } catch (err) {
      setError(err.message || "Unable to load buyers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);

  const handleSubmitFlag = async (reason) => {
    const buyerId = getUserId(selectedBuyer);

    // ✅ FIX: strict validation (prevents BuyerId = 0 bug)
    if (!selectedBuyer || !buyerId || buyerId === 0) {
      addToast({
        variant: "error",
        message: "Invalid buyer selected. Please refresh and try again.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await flagBuyer(buyerId, reason);

      addToast({
        variant: "success",
        message: `${selectedBuyer?.name || "Buyer"} reported successfully.`,
      });

      setSelectedBuyer(null);
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Unable to report this buyer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container py-4 report-directory-shell">
        <section className="card report-directory-card">
          <div className="card-body p-4 p-lg-5">

            {loading ? (
              <LoadingSpinner message="Loading buyers..." />
            ) : error ? (
              <>
                <AlertMessage type="danger">{error}</AlertMessage>
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={loadBuyers}
                >
                  Try again
                </button>
              </>
            ) : buyers.length === 0 ? (
              <div className="report-empty-state">
                <h3>No buyers available</h3>
                <p>Buyer accounts will appear here when available.</p>
              </div>
            ) : (
              <div className="report-card-grid">
                {buyers.map((buyer) => {
                  const buyerId = getUserId(buyer);

                  return (
                    <article className="card report-user-card" key={buyerId || buyer.email}>
                      <div className="card-body">

                        <h3>{buyer?.name || "Unnamed Buyer"}</h3>
                        <p>{buyer?.email || "No email"}</p>

                        <button
                          className="btn btn-danger"
                          onClick={() => setSelectedBuyer(buyer)}
                          // ✅ FIX: block invalid IDs
                          disabled={!buyerId || buyerId === 0}
                        >
                          Report Buyer
                        </button>

                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <FlagUserModal
        user={selectedBuyer}
        isOpen={Boolean(selectedBuyer)}
        loading={submitting}
        onClose={() => !submitting && setSelectedBuyer(null)}
        onSubmit={handleSubmitFlag}
        title="Report Buyer"
        submitLabel="Submit Report"
        showUserId={false}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default FlagBuyer;