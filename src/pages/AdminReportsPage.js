import { useEffect, useState } from "react";
import Reports from "../components/Reports";
import { getAdminReports } from "../services/adminService";

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const nextReports = await getAdminReports();
      setReports(nextReports);
    } catch (err) {
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <Reports
      reports={reports}
      loading={loading}
      error={error}
      onRetry={loadReports}
    />
  );
}

export default AdminReportsPage;
