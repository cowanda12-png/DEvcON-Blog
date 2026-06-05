import { FaUserCircle, FaHeart, FaFileAlt, FaComments, FaBlog } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardProfile = () => {
  const backendURL = useSelector((state) => state.prod.link);
  const [profile, setProfile] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([
    { title: "My Blogs", value: 0, icon: <FaBlog />, color: "primary" },
    { title: "Favourites", value: 8, icon: <FaHeart />, color: "danger" },
    { title: "Comments", value: 24, icon: <FaComments />, color: "warning" },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await axios.get(`${backendURL}/api/auth/getUserProfile`, {
          withCredentials: true,
        });
        const userProfile = profileRes.data.data;
        setProfile(userProfile);

        if (userProfile?._id) {
          const blogsRes = await axios.get(`${backendURL}/api/admin/blogs`, {
            withCredentials: true,
          });
          const allBlogs = blogsRes.data || [];
          const myBlogs = allBlogs.filter(blog => blog.author === userProfile._id);
          setUserBlogs(myBlogs);
          setStats(prev => prev.map(stat =>
            stat.title === "My Blogs" ? { ...stat, value: myBlogs.length } : stat
          ));
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [backendURL]);

  const getAvatarUrl = () => {
    if (!profile?.userAvatar) return null;
    if (profile.userAvatar.startsWith("http")) return profile.userAvatar;
    return `${backendURL}${profile.userAvatar}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      {/* Profile Header Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-center gap-4 bg-primary text-white">
          {/* Avatar */}
          <div
            className="d-flex justify-content-center align-items-center rounded-circle bg-white shadow overflow-hidden flex-shrink-0"
            style={{ width: "80px", height: "80px" }}
          >
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <FaUserCircle size={55} color="#0d6efd" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-grow-1 text-center text-md-start">
            <h2 className="fw-bold mb-1">Welcome Back, {profile?.userName || "User"}</h2>
            <p className="mb-2 opacity-75">Manage your blogs, favourites and profile here.</p>
            <div className="mt-2">
              <small className="opacity-75">Email: </small>
              <span className="fw-semibold">{profile?.userEmail || "N/A"}</span>
            </div>
          </div>
          <span className="badge bg-white text-primary rounded-pill px-3 py-2">Active User</span>
        </div>
      </div>

      {/* Stats Cards (same style as admin dashboard) */}
      <div className="row g-4 mb-5">
        {stats.map((stat, i) => (
          <div className="col-md-4" key={i}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <div
                  className={`bg-${stat.color} bg-opacity-10 text-${stat.color} rounded-3 d-inline-flex align-items-center justify-content-center mb-3`}
                  style={{ width: "55px", height: "55px", fontSize: "1.5rem" }}
                >
                  {stat.icon}
                </div>
                <h3 className="fw-bold">{stat.value}</h3>
                <p className="text-muted mb-0">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Blogs Table (like admin dashboard) */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <h5 className="fw-bold mb-4">Your Recent Blog Posts</h5>
          {userBlogs.length === 0 ? (
            <p className="text-muted">You haven't written any blogs yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userBlogs.slice(0, 5).map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <Link to={`/description/${blog._id}`} target="_blank">
                          {blog.blogTitle}
                        </Link>
                      </td>
                      <td>{new Date(blog.createdAt).toDateString()}</td>
                      <td><span className="badge bg-success">Published</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {userBlogs.length > 5 && (
            <div className="text-end mt-3">
              <Link to="/profile" className="btn btn-link">View all your blogs →</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardProfile;