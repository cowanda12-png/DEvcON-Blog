import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaEdit,
  FaUserShield,
  FaSignOutAlt,
  FaTags,
} from "react-icons/fa";

const AdminSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.prod.link);

  const Links = [
    { name: "Dashboard", to: "/admin-dashboard", icon: <FaTachometerAlt /> },
    { name: "Add Blog", to: "/admin-dashboard/add-blog", icon: <FaPlusCircle /> },
    { name: "Manage Blogs", to: "/admin-dashboard/manage-blog", icon: <FaEdit /> },
    { name: "Manage Categories", to: "/admin-dashboard/manage-categories", icon: <FaTags /> },
  ];

  const handleLogout = async () => {
    try {
      // Call the logout endpoint (works for both user and admin)
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/adminLogin");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the request fails, we can still redirect and let the cookie expire
      toast.error("Logout failed, but you will be redirected.");
      navigate("/adminLogin");
    }
  };

  // Helper to check if a link is active (supports nested routes)
  const isActive = (to) => {
    if (to === "/admin-dashboard") return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div
      className="d-flex flex-column bg-white border-end h-100"
      style={{
        width: "100%",
        padding: "2rem 1.5rem",
        boxShadow: "0 0 15px rgba(0,0,0,0.04)",
      }}
    >
      <div className="text-center mb-5">
        <FaUserShield size={70} className="text-primary mb-3" />
        <h5 className="fw-bold mb-1">Admin Panel</h5>
        <p className="text-muted small">Blog Management System</p>
      </div>

      <ul className="nav nav-pills flex-column gap-2">
        {Links.map((item) => (
          <li className="nav-item" key={item.to}>
            <Link
              to={item.to}
              className="nav-link d-flex align-items-center gap-3 fw-semibold"
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "14px",
                transition: "0.3s ease",
                backgroundColor: isActive(item.to) ? "#0d6efd" : "transparent",
                color: isActive(item.to) ? "white" : "#212529",
                boxShadow: isActive(item.to) ? "0 4px 12px rgba(13,110,253,0.25)" : "none",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto mb-3">
        <div
          style={{
            background: "linear-gradient(135deg, #0d6efd, #4f8dfd)",
            color: "white",
            borderRadius: "18px",
            padding: "1.2rem",
            boxShadow: "0 4px 15px rgba(13,110,253,0.2)",
          }}
        >
          <h6 className="fw-bold">Manage Content</h6>
          <p className="small mb-0">
            Create, edit and organize blogs easily from your dashboard.
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default AdminSideBar;