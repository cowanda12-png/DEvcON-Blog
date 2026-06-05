import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.prod.link);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image", "video"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await axios.get(`${backendUrl}/api/categories`, { withCredentials: true });
        setCategories(catRes.data);

        // Fetch single blog
        const blogRes = await axios.get(`${backendUrl}/api/admin/blog/${id}`, { withCredentials: true });
        const blog = blogRes.data;

        setBlogTitle(blog.blogTitle);
        setBlogDescription(blog.blogDescription);
        setBlogContent(blog.blogContent);
        setExistingImage(blog.blogImage);
        setCategoryId(blog.category._id || blog.category);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog data");
        navigate("/admin-dashboard/manage-blog");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl, id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!blogContent || blogContent === "<p><br></p>") {
      toast.error("Content cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("blogTitle", blogTitle);
      formData.append("blogDescription", blogDescription);
      formData.append("blogContent", blogContent);
      formData.append("categoryId", categoryId);
      if (blogImage) formData.append("blogImage", blogImage);

      await axios.put(`${backendUrl}/api/admin/update-blog/${id}`, formData, { withCredentials: true });
      toast.success("Blog updated successfully!");
      navigate("/admin-dashboard/manage-blog");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update blog");
    } finally {
      setSubmitting(false);
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
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Update Blog</h2>
        <p className="text-muted">Edit the details below and save changes.</p>
      </div>

      <form className="card border-0 shadow-sm rounded-4 p-4" onSubmit={handleUpdate}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Blog Title"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            required
          />
          <label htmlFor="title">Title</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Short description"
            value={blogDescription}
            onChange={(e) => setBlogDescription(e.target.value)}
            required
          />
          <label htmlFor="description">Description</label>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Category *</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Content *</label>
          <ReactQuill
            theme="snow"
            value={blogContent}
            onChange={setBlogContent}
            modules={modules}
            formats={formats}
            style={{ height: "300px", marginBottom: "50px" }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Current Image</label>
          <div className="mb-2">
            <img
              src={`${backendUrl}${existingImage}`}
              alt="Current"
              style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
              className="border rounded"
            />
          </div>
          <label className="form-label fw-semibold">Upload New Image (optional)</label>
          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setBlogImage(e.target.files[0])}
          />
          <small className="text-muted">Leave empty to keep the current image.</small>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3" disabled={submitting}>
          {submitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBlog;