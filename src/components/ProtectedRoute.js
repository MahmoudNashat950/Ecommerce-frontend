import { Navigate } from "react-router-dom";
import { getToken, getUserRole, normalizeRole } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  const token = getToken();
  const userRole = normalizeRole(getUserRole());
  const allowedRoles = (Array.isArray(role) ? role : [role])
    .filter(Boolean)
    .map(normalizeRole);

  const getHomePath = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "seller") return "/seller";
    if (userRole === "buyer") return "/buyer";
    return "/";
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={getHomePath()} replace />;
  }

  return children;
}

export default ProtectedRoute;
