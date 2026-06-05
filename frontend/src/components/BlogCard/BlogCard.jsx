import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  // Format the date if createdAt exists
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toDateString()
    : "Recent";

  return (
    <div className="card blog-card border-0 shadow-sm h-100">
      {/* Optional: show blog image at the top */}
      {blog.blogImage && (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}${blog.blogImage}`}
          className="card-img-top"
          alt={blog.blogTitle}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}

      <div className="card-body d-flex flex-column">
        <small className="text-secondary mb-2">{formattedDate}</small>

        <h4 className="fw-bold mb-3">{blog.blogTitle}</h4>

        <p className="text-muted flex-grow-1">
          {blog.blogDescription?.substring(0, 120)}...
        </p>

        <Link
          to={`/description/${blog._id}`}
          className="btn btn-outline-primary btn-sm mt-3"
        >
          Read More
        </Link>
      </div>

      <style>
        {`
          .blog-card {
            transition: 0.3s ease;
            border-radius: 16px;
            overflow: hidden;
            background: #ffffff;
          }
          .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
          }
        `}
      </style>
    </div>
  );
};

export default BlogCard;