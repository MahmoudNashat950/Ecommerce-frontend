import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAdminReports, getAdminUsers } from "../services/adminService";

const isBannedUser = (user) => {
  const rawStatus = typeof user?.status === "string" ? user.status.toLowerCase() : "";

  return (
    rawStatus.includes("ban") ||
    user?.isBanned === true ||
    user?.banned === true ||
    user?.active === false ||
    user?.isActive === false
  );
};

const isOpenReport = (report) => {
  const status = String(
    report?.status ??
      report?.state ??
      report?.resolution ??
      (report?.resolved === true ? "resolved" : "open")
  ).toLowerCase();

  return !/(closed|resolved|done|approved|dismissed)/.test(status);
};

const getReportTitle = (report) =>
  report?.title ||
  report?.type ||
  report?.category ||
  report?.reason ||
  `Report ${report?.id ?? report?.reportId ?? report?._id ?? ""}`.trim();

const getReportDescription = (report) =>
  report?.description ||
  report?.details ||
  report?.message ||
  report?.reasonText ||
  "No extra details were provided for this report.";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    users: [],
    reports: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [users, reports] = await Promise.all([getAdminUsers(), getAdminReports()]);
      setSummary({ users, reports });
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="admin-panel">
        <LoadingSpinner message="Loading dashboard..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-panel">
        <AlertMessage type="danger">{error}</AlertMessage>
        <button type="button" className="btn btn-outline-primary mt-3" onClick={loadDashboard}>
          Try again
        </button>
      </section>
    );
  }

  const totalUsers = summary.users.length;
  const bannedUsers = summary.users.filter(isBannedUser).length;
  const activeUsers = totalUsers - bannedUsers;
  const totalReports = summary.reports.length;
  const openReports = summary.reports.filter(isOpenReport).length;
  const latestReports = summary.reports.slice(0, 3);

  return (
    <>
      <section className="admin-summary-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-label">Users</span>
          <p className="admin-stat-value">{totalUsers}</p>
          <p className="admin-stat-copy">Total registered accounts available from the admin API.</p>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-label">Active</span>
          <p className="admin-stat-value">{activeUsers}</p>
          <p className="admin-stat-copy">Users currently marked as active and allowed to access the platform.</p>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-label">Banned</span>
          <p className="admin-stat-value">{bannedUsers}</p>
          <p className="admin-stat-copy">Accounts that are blocked or otherwise treated as banned.</p>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-label">Reports</span>
          <p className="admin-stat-value">{openReports}/{totalReports}</p>
          <p className="admin-stat-copy">Open versus total reports waiting in the moderation workflow.</p>
        </article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">Quick actions</h3>
            <p className="admin-panel-copy">Jump straight into the admin areas that need attention.</p>
          </div>
        </div>

        <div className="admin-quick-links">
          <Link className="btn btn-primary" to="/admin/users">
            Manage users
          </Link>
          <Link className="btn btn-outline-primary" to="/admin/reports">
            View reports
          </Link>
          <button type="button" className="btn btn-outline-secondary" onClick={loadDashboard}>
            Refresh summary
          </button>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">Latest reports</h3>
            <p className="admin-panel-copy">A quick preview of the most recent items returned by the reports endpoint.</p>
          </div>
        </div>

        {latestReports.length === 0 ? (
          <div className="admin-empty-state">
            <h3 className="admin-empty-title">No recent reports</h3>
            <p className="admin-empty-copy">
              Once the API returns reports, the latest entries will appear here for quick review.
            </p>
          </div>
        ) : (
          <div className="admin-list">
            {latestReports.map((report) => (
              <div
                className="admin-list-item"
                key={report?.id ?? report?.reportId ?? report?._id ?? getReportTitle(report)}
              >
                <div>
                  <p className="admin-list-title">{getReportTitle(report)}</p>
                  <p className="admin-list-copy">{getReportDescription(report)}</p>
                </div>

                <Link className="btn btn-outline-primary" to="/admin/reports">
                  Open queue
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default AdminDashboard;
