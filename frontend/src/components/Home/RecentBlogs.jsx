import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RecentBlogs = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/blogs?limit=3`);
        setBlogs(res.data.blogs);
      } catch (error) {
        console.error("Failed to fetch recent blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBlogs();
  }, [backendUrl]);

  if (loading) return <div className="text-center py-5">Loading recent posts...</div>;
  if (blogs.length === 0) return <div className="container text-center py-5">No blogs yet.</div>;

  return (
    <section className="container my-5">
      <h2 className="fw-bold mb-4 text-center">Recent Blog Posts</h2>
      <div className="row g-4">
        {blogs.map((blog) => (
          <div className="col-md-4" key={blog._id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              {blog.blogImage && (
                <img
                  src={`${backendUrl}${blog.blogImage}`}
                  className="card-img-top"
                  alt={blog.blogTitle}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{blog.blogTitle}</h5>
                <p className="card-text text-muted">{blog.blogDescription.substring(0, 100)}...</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">{new Date(blog.createdAt).toDateString()}</small>
                  <Link to={`/description/${blog._id}`} className="btn btn-sm btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/blogs" className="btn btn-outline-primary rounded-pill px-4">
          View All Blogs
        </Link>
      </div>
    </section>
  );
};

export default RecentBlogs;