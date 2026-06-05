import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserGear } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import {
  FaHome,
  FaHeart,
  FaThumbsUp,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { authActions } from "../../store/auth";
import { toast } from "react-toastify";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backendLink = useSelector((state) => state.prod.link);
  const user = useSelector((state) => state.user.user);

  const SideBarLinks = [
    { name: "Dashboard", to: "/profile", icon: <FaHome /> },
    { name: "Favourites", to: "/profile/favourites", icon: <FaHeart /> },
    { name: "Liked Blogs", to: "/profile/liked-blogs", icon: <FaThumbsUp /> },
    { name: "Manage Account", to: "/profile/manage-account", icon: <FaUserGear /> },
    { name: "Help", to: "/profile/help-section", icon: <FiHelpCircle /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${backendLink}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(authActions.logout());
      if (res.data.message) toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server is unreachable. Please try again later!");
      }
    }
  };

  return (
    <div className="d-flex flex-column bg-white border-end h-100" style={{ padding: "1.5rem 1rem" }}>
      <ul className="nav nav-pills flex-column gap-2 mb-4">
        {SideBarLinks.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <li className="nav-item" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-dark"
                }`}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto">
        <div className="card border-0 bg-primary text-white rounded-3 shadow-sm mb-3">
          <div className="card-body p-3">
            <h6 className="fw-bold">Keep Writing</h6>
            <p className="small mb-0">Share your ideas and inspire others with your blogs.</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold w-100"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;