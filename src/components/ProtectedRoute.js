import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  //  No token
  if (!token) {
    return <Navigate to="/login" />;
  }

  //  Wrong role
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;