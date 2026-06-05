import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { BsChatRightQuote } from "react-icons/bs";

const Description = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.prod.link);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/blogs/${id}`, {
          withCredentials: false,
        });
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Blog not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, backendUrl]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">{error || "Blog not found"}</div>
        <button className="btn btn-primary" onClick={() => navigate("/blogs")}>
          Back to Blogs
        </button>
      </div>
    );
  }

  // Format date
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toDateString()
    : "Unknown date";

  return (
    <div className="container my-5">
      {/* Hero section with category and date */}
      <div className="text-center mb-5">
        <span className="badge bg-primary mb-3 px-3 py-2 rounded-pill">
          {blog.category?.name || "Uncategorized"}
        </span>
        <h1 className="display-5 fw-bold mb-3">{blog.blogTitle}</h1>
        <p className="lead text-muted">{blog.blogDescription}</p>
        <div className="text-muted">
          <span>📅 {formattedDate}</span>
        </div>
      </div>

      {/* Featured image */}
      {blog.blogImage && (
        <div className="row justify-content-center mb-5">
          <div className="col-md-10">
            <img
              src={`${backendUrl}${blog.blogImage}`}
              alt={blog.blogTitle}
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      )}

      {/* Author card (static for now) */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="row g-0 align-items-center">
              <div className="col-md-3 text-center p-3">
                <img
                  src="/logo.png"
                  alt="Author"
                  className="rounded-circle img-fluid"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-9">
                <div className="card-body">
                  <h5 className="card-title mb-1">Collins Baraka (Engineer)</h5>
                  <p className="text-muted mb-2">Software Developer </p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog content (rendered as HTML) */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 bg-light">
            <div className="card-body p-4">
              <div
                dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                className="blog-content"
              />
              <hr className="my-4" />
              <p className="fst-italic text-muted">
                <i className="me-2">
                  <BsChatRightQuote />
                </i>
                "Nothing to prove to Anyone becasue my Tradition and Culture is Original!"
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .blog-content h1, .blog-content h2, .blog-content h3 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          .blog-content p {
            margin-bottom: 1rem;
            line-height: 1.6;
          }
          .blog-content ul, .blog-content ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
          }
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
          }
        `}
      </style>
    </div>
  );
};

export default Description;