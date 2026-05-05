import { useEffect, useState } from "react";
import FlagUserModal from "../components/FlagUserModal";
import ToastContainer from "../components/ToastContainer";
import UsersTable from "../components/UsersTable";
import useToast from "../hooks/useToast";
import { normalizeRole } from "../utils/auth";
import {
  banAdminUser,
  deleteAdminUser,
  getAdminUsers,
  unbanAdminUser,
} from "../services/adminService";
import { flagBuyer, flagSeller } from "../services/flagService";

const actionMessages = {
  ban: "User banned successfully.",
  unban: "User unbanned successfully.",
  delete: "User deleted successfully.",
};

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [selectedFlagUser, setSelectedFlagUser] = useState(null);
  const [flagLoading, setFlagLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const loadUsers = async ({ showSpinner = true } = {}) => {
    if (showSpinner) {
      setLoading(true);
    }

    setError("");

    try {
      const nextUsers = await getAdminUsers();
      setUsers(nextUsers);
      return true;
    } catch (err) {
      setError(err.message || "Unable to load users.");
      return false;
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenFlagModal = (user) => {
    setSelectedFlagUser(user);
  };

  const handleCloseFlagModal = () => {
    if (flagLoading) {
      return;
    }

    setSelectedFlagUser(null);
  };

  const handleUserAction = async (user, action) => {
    const userId = user?.id ?? user?.userId ?? user?._id ?? null;

    if (userId === null) {
      addToast({
        variant: "error",
        message: "This user cannot be updated because no user ID was provided.",
      });
      return;
    }

    if (
      action === "delete" &&
      !window.confirm(`Delete user ${user?.name || user?.email || userId}?`)
    ) {
      return;
    }

    setPendingActionKey(`${action}:${userId}`);

    try {
      if (action === "ban") {
        await banAdminUser(userId);
      } else if (action === "unban") {
        await unbanAdminUser(userId);
      } else {
        await deleteAdminUser(userId);
      }

      addToast({
        variant: "success",
        message: actionMessages[action],
      });

      const refreshed = await loadUsers({ showSpinner: false });

      if (!refreshed) {
        addToast({
          variant: "warning",
          message: "The action succeeded, but the users list could not be refreshed.",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Unable to complete this action.",
      });
    } finally {
      setPendingActionKey("");
    }
  };

  const handleSubmitFlag = async (reason) => {
    const user = selectedFlagUser;
    const userId = user?.id ?? user?.userId ?? user?._id ?? null;
    const userRole = normalizeRole(user?.role);

    if (userId === null) {
      addToast({
        variant: "error",
        message: "This user cannot be flagged because no user ID was provided.",
      });
      return;
    }

    if (userRole !== "buyer" && userRole !== "seller") {
      addToast({
        variant: "error",
        message: "Only buyer and seller accounts can be flagged.",
      });
      return;
    }

    setFlagLoading(true);

    try {
      if (userRole === "seller") {
        await flagSeller(userId, reason);
      } else {
        await flagBuyer(userId, reason);
      }

      addToast({
        variant: "success",
        message: `${user?.name || user?.email || "User"} flagged successfully.`,
      });

      setSelectedFlagUser(null);

      const refreshed = await loadUsers({ showSpinner: false });

      if (!refreshed) {
        addToast({
          variant: "warning",
          message: "The flag was submitted, but the users list could not be refreshed.",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Unable to flag this user.",
      });
    } finally {
      setFlagLoading(false);
    }
  };

  return (
    <>
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        onRetry={() => loadUsers()}
        onAction={handleUserAction}
        onFlagUser={handleOpenFlagModal}
        pendingActionKey={pendingActionKey}
      />

      <FlagUserModal
        user={selectedFlagUser}
        isOpen={Boolean(selectedFlagUser)}
        loading={flagLoading}
        onClose={handleCloseFlagModal}
        onSubmit={handleSubmitFlag}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default AdminUsersPage;
