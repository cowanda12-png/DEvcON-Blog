import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const ManageCategories = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Fetch categories – defined inside useEffect to avoid dependency warning
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`, { withCredentials: true });
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setFetching(false);
      }
    };
    fetchCategories();
  }, [backendUrl]); // ✅ only depends on backendUrl

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/categories`,
        { name: categoryName },
        { withCredentials: true }
      );
      toast.success(`Category "${res.data.name}" created!`);
      setCategoryName("");
      // Refresh list manually: refetch after creation
      const refreshed = await axios.get(`${backendUrl}/api/categories`, { withCredentials: true });
      setCategories(refreshed.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error || "Category already exists");
      } else {
        toast.error("Failed to create category.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This action cannot be undone.`)) return;
    try {
      await axios.delete(`${backendUrl}/api/categories/${id}`, { withCredentials: true });
      toast.success(`Category "${name}" deleted`);
      // Refresh list after deletion
      const refreshed = await axios.get(`${backendUrl}/api/categories`, { withCredentials: true });
      setCategories(refreshed.data);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h3 className="fw-bold mb-3">Create New Category</h3>
        <p className="text-muted">Add a category that blogs can belong to.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label fw-semibold">Category Name *</label>
            <input
              type="text"
              className="form-control"
              id="categoryName"
              placeholder="e.g., MERN Stack, Education, Health"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={loading}
              required
            />
            <small className="text-muted">Category names must be unique.</small>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Add Category"}
          </button>
        </form>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h4 className="fw-bold mb-3">Existing Categories</h4>
        {fetching ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted">No categories yet. Create one above.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="btn btn-sm btn-outline-danger"
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
    </div>
  );
};

export default ManageCategories;