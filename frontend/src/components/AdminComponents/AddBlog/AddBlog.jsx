import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const AddBlog = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.prod.link);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image", "video",
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`, {
          withCredentials: true,
        });
        setCategories(res.data);
        if (res.data.length > 0) setCategoryId(res.data[0]._id);
      } catch (error) {
        console.error("Failed to load categories", error);
        toast.error("Could not load categories. Please refresh.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Please select a category for the blog.");
      return;
    }
    if (!blogContent || blogContent === "<p><br></p>") {
      toast.error("Please write some content for the blog.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("blogTitle", blogTitle);
      formData.append("blogDescription", blogDescription);
      formData.append("blogContent", blogContent);
      formData.append("blogImage", blogImage);
      formData.append("categoryId", categoryId);

      const res = await axios.post(`${backendUrl}/api/admin/create-blog`, formData, {
        withCredentials: true,
      });

      toast.success("Blog published successfully!");
      console.log(res.data);

      // ✅ Redirect to home page
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to publish blog. Please try again.");
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Create New Blog</h2>
        <p className="text-muted">Fill in the details below to publish a new blog post.</p>
      </div>

      <form className="card border-0 shadow-sm rounded-4 p-4" onSubmit={handleCreateBlog}>
        {/* Title */}
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

        {/* Description */}
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

        {/* Category Dropdown */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Category *</label>
          {loadingCategories ? (
            <div className="spinner-border spinner-border-sm" role="status" />
          ) : (
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          <small className="text-muted">Select the category this blog belongs to</small>
        </div>

        {/* Rich Text Editor for Content */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Content *</label>
          <ReactQuill
            theme="snow"
            value={blogContent}
            onChange={setBlogContent}
            modules={modules}
            formats={formats}
            placeholder="Write your blog content here... Use the toolbar to format text, add lists, images, etc."
            style={{ height: "300px", marginBottom: "50px" }}
          />
          <small className="text-muted">You can make text bold, add paragraphs, lists, and more.</small>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Upload Image</label>
          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setBlogImage(e.target.files[0])}
            required
          />
          <small className="text-muted">Allowed formats: JPG, JPEG, PNG</small>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;