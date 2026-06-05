import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BlogCard from "../../components/BlogCard/BlogCard";

const BlogList = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/blogs`, {
          withCredentials: false, // public route, no credentials needed
        });
        // API returns { blogs, total, page, limit }
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Could not load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2
        className="text-center fw-bold mb-5"
        style={{ color: "#171819" }}
      >
        All Blogs
      </h2>

      {blogs.length === 0 ? (
        <div className="text-center text-muted">No blogs available yet.</div>
      ) : (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-12 col-md-4">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;