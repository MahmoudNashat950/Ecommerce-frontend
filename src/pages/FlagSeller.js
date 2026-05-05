import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import FlagUserModal from "../components/FlagUserModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";
import { getAdminUsers } from "../services/adminService";
import { flagSeller } from "../services/flagService";

const getUserId = (user) => user?.id ?? user?.userId ?? user?._id ?? null;
const isSeller = (user) => String(user?.role || "").trim().toLowerCase() === "seller";

function FlagSeller() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const loadSellers = async () => {
    setLoading(true);
    setError("");

    try {
      const users = await getAdminUsers();
      const nextSellers = users.filter(isSeller);
      setSellers(nextSellers);
    } catch (err) {
      setError(err.message || "Unable to load sellers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleSubmitFlag = async (reason) => {
    const sellerId = getUserId(selectedSeller);

    if (sellerId === null) {
      addToast({
        variant: "error",
        message: "This seller cannot be reported because no user ID was provided.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await flagSeller(sellerId, reason);
      addToast({
        variant: "success",
        message: `${selectedSeller?.name || selectedSeller?.email || "Seller"} reported successfully.`,
      });
      setSelectedSeller(null);
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Unable to report this seller.",
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
            <div className="report-directory-header">
              <div>
                <p className="report-directory-kicker">Buyer Reporting</p>
                <h2 className="report-directory-title">Browse Sellers</h2>
                <p className="report-directory-copy">
                  Choose the seller you want to report, open the report form, and submit a reason without typing IDs manually.
                </p>
              </div>

              <div className="report-directory-actions">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={loadSellers}
                  disabled={loading}
                >
                  Refresh
                </button>
                <Link className="btn btn-outline-secondary" to="/buyer/catalog">
                  Back to Catalog
                </Link>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading sellers..." />
            ) : error ? (
              <>
                <AlertMessage type="danger">{error}</AlertMessage>
                <button type="button" className="btn btn-outline-primary mt-3" onClick={loadSellers}>
                  Try again
                </button>
              </>
            ) : sellers.length === 0 ? (
              <div className="report-empty-state">
                <h3 className="report-empty-title">No sellers available</h3>
                <p className="report-empty-copy">
                  Seller accounts will appear here as soon as the marketplace returns them from the API.
                </p>
              </div>
            ) : (
              <div className="report-card-grid">
                {sellers.map((seller) => (
                  <article className="card report-user-card" key={getUserId(seller) ?? seller?.email ?? seller?.name}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <h3 className="report-user-title">{seller?.name || "Unnamed Seller"}</h3>
                          {seller?.email ? (
                            <p className="report-user-email">{seller.email}</p>
                          ) : (
                            <p className="report-user-email text-muted">Email not available</p>
                          )}
                        </div>

                        <span className="report-role-pill">Seller</span>
                      </div>

                      <p className="report-user-copy">
                        Open the report form to share the reason for reporting this seller.
                      </p>

                      <button
                        type="button"
                        className="btn btn-danger mt-auto"
                        onClick={() => setSelectedSeller(seller)}
                        disabled={getUserId(seller) === null}
                      >
                        Report Seller
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <FlagUserModal
        user={selectedSeller}
        isOpen={Boolean(selectedSeller)}
        loading={submitting}
        onClose={() => {
          if (!submitting) {
            setSelectedSeller(null);
          }
        }}
        onSubmit={handleSubmitFlag}
        title="Report Seller"
        kicker="Buyer Report"
        description={
          selectedSeller
            ? `Report ${selectedSeller.name || selectedSeller.email || "this seller"} by sharing the reason below.`
            : undefined
        }
        submitLabel="Submit Report"
        showUserId={false}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default FlagSeller;
