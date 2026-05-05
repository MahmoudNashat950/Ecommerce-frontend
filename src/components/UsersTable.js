import AlertMessage from "./AlertMessage";
import LoadingSpinner from "./LoadingSpinner";

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

const getUserId = (user) => user?.id ?? user?.userId ?? user?._id ?? null;

const getUserStatus = (user) => {
  const rawStatus = typeof user?.status === "string" ? user.status.toLowerCase() : "";

  if (
    rawStatus.includes("ban") ||
    user?.isBanned === true ||
    user?.banned === true ||
    user?.active === false ||
    user?.isActive === false
  ) {
    return {
      label: "Banned",
      tone: "danger",
      isBanned: true,
    };
  }

  if (
    rawStatus.includes("active") ||
    user?.isBanned === false ||
    user?.banned === false ||
    user?.active === true ||
    user?.isActive === true
  ) {
    return {
      label: "Active",
      tone: "success",
      isBanned: false,
    };
  }

  if (user?.status) {
    return {
      label: formatLabel(user.status),
      tone: "neutral",
      isBanned: false,
    };
  }

  return {
    label: "Unknown",
    tone: "neutral",
    isBanned: false,
  };
};

function UsersTable({
  users,
  loading,
  error,
  onRetry,
  onAction,
  onFlagUser,
  pendingActionKey,
}) {
  if (loading) {
    return (
      <section className="admin-panel">
        <LoadingSpinner message="Loading users..." />
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

  if (!users.length) {
    return (
      <section className="admin-panel">
        <div className="admin-empty-state">
          <h3 className="admin-empty-title">No users found</h3>
          <p className="admin-empty-copy">
            The users endpoint returned an empty list. Refresh once new accounts are available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">User Directory</h3>
          <p className="admin-panel-copy">Manage roles, status, and moderation actions in one table.</p>
        </div>

        <button type="button" className="btn btn-outline-primary" onClick={onRetry}>
          Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="table admin-table align-middle">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userId = getUserId(user);
              const status = getUserStatus(user);
              const busyForUser = pendingActionKey?.endsWith(`:${userId}`);
              const normalizedRole = String(user?.role || "").trim().toLowerCase();
              const canFlag = normalizedRole === "buyer" || normalizedRole === "seller";

              return (
                <tr key={userId ?? `${user?.email}-${user?.name}`}>
                  <td>{userId ?? "N/A"}</td>
                  <td>
                    <div className="admin-user-name">{user?.name || "Unnamed User"}</div>
                  </td>
                  <td>
                    <div className="admin-user-email">{user?.email || "N/A"}</div>
                  </td>
                  <td>{formatLabel(user?.role, "User")}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${status.tone}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-group justify-content-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={busyForUser || !canFlag || userId === null}
                        onClick={() => onFlagUser?.(user)}
                        title={canFlag ? "Flag this user" : "Only buyer and seller accounts can be flagged"}
                      >
                        Flag User
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        disabled={busyForUser || status.isBanned || userId === null}
                        onClick={() => onAction(user, "ban")}
                      >
                        {pendingActionKey === `ban:${userId}` ? "Working..." : "Ban"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        disabled={busyForUser || !status.isBanned || userId === null}
                        onClick={() => onAction(user, "unban")}
                      >
                        {pendingActionKey === `unban:${userId}` ? "Working..." : "Unban"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyForUser || userId === null}
                        onClick={() => onAction(user, "delete")}
                      >
                        {pendingActionKey === `delete:${userId}` ? "Working..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UsersTable;
