import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../utils/auth";

const navItems = [
  {
    label: "Dashboard",
    meta: "Overview",
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    meta: "Accounts",
    path: "/admin/users",
  },
  {
    label: "Reports",
    meta: "Moderation",
    path: "/admin/reports",
  },
];

const pageContent = {
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Track platform activity, moderate reports, and manage customer accounts from one place.",
  },
  users: {
    title: "Users Management",
    subtitle: "Review account details, moderate access, and keep the user base healthy.",
  },
  reports: {
    title: "Reports Queue",
    subtitle: "Monitor incoming reports and keep moderation work organized.",
  },
};

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = location.pathname.split("/")[2] || "dashboard";
  const currentPage = pageContent[currentSection] || pageContent.dashboard;

  useEffect(() => {
    document.body.classList.add("admin-route");

    return () => {
      document.body.classList.remove("admin-route");
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <h1 className="admin-brand">Control Center</h1>
          <p className="admin-sidebar-copy">
            Manage users, review reports, and keep the marketplace running smoothly.
          </p>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " active" : ""}`
              }
            >
              <span className="admin-nav-label">{item.label}</span>
              <span className="admin-nav-meta">{item.meta}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="btn btn-light w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">Admin Workspace</p>
            <h2 className="admin-page-title">{currentPage.title}</h2>
            <p className="admin-page-subtitle">{currentPage.subtitle}</p>
          </div>

          <div className="admin-topbar-meta">JWT-secured admin access</div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
