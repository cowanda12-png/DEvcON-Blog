import axios from "axios";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const EditBlog = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/blogs`, {
          withCredentials: true,
        });
        setBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
        toast.error("Could not load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backendUrl]); // ✅ fetchBlogs defined inside, so no missing dependency

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await axios.delete(`${backendUrl}/api/admin/delete-blog/${id}`, {
          withCredentials: true,
        });
        toast.success("Blog deleted successfully");
        // Refresh list: trigger re-fetch by re-running effect? simpler: call fetch again but we need access.
        // We can re-fetch by setting loading true and calling fetchBlogs again.
        // Since fetchBlogs is not in scope, we'll repeat the logic or use a ref. Better: extract to a function and useCallback.
        // But to keep simple, we'll re-run the effect by toggling a key or just re-fetch manually.
        // Let's do a manual fetch after delete.
        try {
          const res = await axios.get(`${backendUrl}/api/admin/blogs`, {
            withCredentials: true,
          });
          setBlogs(res.data);
        } catch (err) {
          toast.error("Could not refresh list");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete blog");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5" style={{ color: "#171819" }}>
        Manage Blogs
      </h2>

      {blogs.length === 0 ? (
        <div className="alert alert-info text-center">No blogs found. Create one!</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, idx) => (
                <tr key={blog._id}>
                  <td>{idx + 1}</td>
                  <td>{blog.blogTitle}</td>
                  <td>{blog.blogDescription.substring(0, 60)}...</td>
                  <td>
                    <span className="badge bg-secondary">
                      {blog.category?.name || "No category"}
                    </span>
                  </td>
                  <td>{new Date(blog.createdAt).toDateString()}</td>
                  <td>
                    <Link
                      to={`/admin-dashboard/update-blog/${blog._id}`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id, blog.blogTitle)}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditBlog;