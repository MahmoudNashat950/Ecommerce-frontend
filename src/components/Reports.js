import AlertMessage from "./AlertMessage";
import LoadingSpinner from "./LoadingSpinner";

const formatLabel = (value, fallback = "N/A") => {
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

const formatDate = (value) => {
  if (!value) {
    return "Unknown date";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleString();
};

const getReportId = (report) => report?.id ?? report?.reportId ?? report?._id ?? "N/A";

const getReportStatus = (report) => {
  const rawStatus =
    report?.status ??
    report?.state ??
    report?.resolution ??
    (report?.resolved === true ? "resolved" : null) ??
    "open";
  const label = formatLabel(rawStatus, "Open");
  const normalized = String(rawStatus).toLowerCase();

  if (/(closed|resolved|done|approved|dismissed)/.test(normalized)) {
    return { label, tone: "success" };
  }

  if (/(pending|review|open|new)/.test(normalized)) {
    return { label, tone: "warning" };
  }

  return { label, tone: "info" };
};

const getReportTitle = (report) =>
  report?.title ||
  report?.type ||
  report?.category ||
  report?.reason ||
  `Report ${getReportId(report)}`;

const getReportDescription = (report) =>
  report?.description ||
  report?.details ||
  report?.message ||
  report?.reasonText ||
  report?.content ||
  "No additional report details were provided.";

const getDetailItems = (report) => {
  const detailMap = [
    ["Reporter", report?.reporterName ?? report?.reportedByName ?? report?.reporterEmail ?? report?.reportedByEmail ?? report?.reporterId ?? report?.reportedById],
    ["Target", report?.targetName ?? report?.targetUserName ?? report?.subject ?? report?.entityType ?? report?.targetUserId ?? report?.entityId],
    ["Reason", report?.reason ?? report?.reasonType ?? report?.category ?? report?.type],
    ["Created", formatDate(report?.createdAt ?? report?.reportedAt ?? report?.createdOn ?? report?.dateCreated)],
  ];

  const extras = Object.entries(report || {})
    .filter(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return false;
      }

      if (typeof value === "object") {
        return false;
      }

      return ![
        "id",
        "reportId",
        "_id",
        "title",
        "type",
        "category",
        "reason",
        "description",
        "details",
        "message",
        "reasonText",
        "content",
        "reporterName",
        "reportedByName",
        "reporterEmail",
        "reportedByEmail",
        "reporterId",
        "reportedById",
        "targetName",
        "targetUserName",
        "targetUserId",
        "subject",
        "entityType",
        "entityId",
        "createdAt",
        "reportedAt",
        "createdOn",
        "dateCreated",
        "status",
        "state",
        "resolution",
        "resolved",
      ].includes(key);
    })
    .slice(0, 2)
    .map(([key, value]) => [formatLabel(key), String(value)]);

  return [...detailMap, ...extras].filter(([, value]) => value && value !== "Unknown date");
};

function Reports({ reports, loading, error, onRetry }) {
  if (loading) {
    return (
      <section className="admin-panel">
        <LoadingSpinner message="Loading reports..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-panel">
        <AlertMessage type="danger">{error}</AlertMessage>
        <button type="button" className="btn btn-outline-primary mt-3" onClick={onRetry}>
          Try again
        </button>
      </section>
    );
  }

  if (!reports.length) {
    return (
      <section className="admin-panel">
        <div className="admin-empty-state">
          <h3 className="admin-empty-title">No reports found</h3>
          <p className="admin-empty-copy">
            The moderation queue is empty right now. New reports will appear here automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Reports Feed</h3>
          <p className="admin-panel-copy">Review incoming reports with a quick scan of status and context.</p>
        </div>

        <button type="button" className="btn btn-outline-primary" onClick={onRetry}>
          Refresh
        </button>
      </div>

      <div className="admin-reports-grid">
        {reports.map((report) => {
          const reportStatus = getReportStatus(report);
          const detailItems = getDetailItems(report);

          return (
            <article className="admin-report-card" key={getReportId(report)}>
              <div className="admin-report-header">
                <div>
                  <h4 className="admin-report-title">{getReportTitle(report)}</h4>
                  <p className="admin-panel-copy mb-0">Report ID: {getReportId(report)}</p>
                </div>

                <span className={`admin-badge admin-badge-${reportStatus.tone}`}>
                  {reportStatus.label}
                </span>
              </div>

              <p className="admin-report-copy">{getReportDescription(report)}</p>

              <div className="admin-detail-grid">
                {detailItems.map(([label, value]) => (
                  <div className="admin-detail-item" key={`${getReportId(report)}-${label}`}>
                    <p className="admin-detail-label">{label}</p>
                    <p className="admin-detail-value">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Reports;
