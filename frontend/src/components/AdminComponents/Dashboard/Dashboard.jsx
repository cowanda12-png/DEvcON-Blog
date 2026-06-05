import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBlog, FaTags, FaHeart, FaComments, FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [adminName, setAdminName] = useState("Admin");
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await axios.get(`${backendUrl}/api/auth/getUserProfile`, {
          withCredentials: true,
        });
        setAdminName(profileRes.data.data?.userName || "Admin");

        const blogsRes = await axios.get(`${backendUrl}/api/admin/blogs`, {
          withCredentials: true,
        });
        setTotalBlogs(blogsRes.data.length || 0);

        const categoriesRes = await axios.get(`${backendUrl}/api/categories`, {
          withCredentials: true,
        });
        setTotalCategories(categoriesRes.data.length || 0);

        const recentRes = await axios.get(`${backendUrl}/api/blogs?limit=5`, {
          withCredentials: false,
        });
        setRecentBlogs(recentRes.data.blogs || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [backendUrl]);

  const stats = [
    { title: "Total Blogs", value: totalBlogs, icon: <FaBlog />, color: "primary", bg: "primary" },
    { title: "Categories", value: totalCategories, icon: <FaTags />, color: "success", bg: "success" },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted">Welcome back, {adminName}</p>
      </div>

      {/* Stats Cards Row */}
      <div className="row g-4 mb-5">
        {stats.map((item, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted text-uppercase fw-semibold small mb-2">
                      {item.title}
                    </h6>
                    <h2 className="fw-bold mb-0 display-5">{item.value}</h2>
                  </div>
                  <div
                    className={`bg-${item.color} bg-opacity-10 rounded-3 p-3`}
                    style={{ lineHeight: 1 }}
                  >
                    <span className={`text-${item.color}`} style={{ fontSize: "1.5rem" }}>
                      {item.icon}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Blogs Section */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="fw-bold mb-0">Recent Blog Posts</h5>
        </div>
        <div className="card-body p-4">
          {recentBlogs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No blogs yet. Create your first blog!</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-0">Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBlogs.map((blog) => (
                      <tr key={blog._id}>
                        <td className="ps-0">
                          <Link
                            to={`/description/${blog._id}`}
                            target="_blank"
                            className="text-decoration-none fw-semibold"
                          >
                            {blog.blogTitle}
                          </Link>
                        </td>
                        <td>
                          <span className="badge bg-secondary bg-opacity-75 px-3 py-2 rounded-pill">
                            {blog.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(blog.createdAt).toDateString()}
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-75 px-3 py-2 rounded-pill">
                            Published
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-4 pt-2 border-top">
                <Link
                  to="/admin-dashboard/manage-blog"
                  className="btn btn-outline-primary rounded-pill px-4"
                >
                  View all blogs →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;