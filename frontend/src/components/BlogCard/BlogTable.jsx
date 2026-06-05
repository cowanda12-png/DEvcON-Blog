import { Link } from "react-router-dom";

const BlogTable = ({ blogs = [], onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-primary">
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Excerpt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="text-muted">
                  {blog.createdAt ? new Date(blog.createdAt).toDateString() : "Unknown"}
                </td>
                <td className="fw-bold">{blog.blogTitle}</td>
                <td className="text-muted" style={{ maxWidth: "400px" }}>
                  {blog.blogDescription?.substring(0, 60)}...
                </td>
                <td>
                  <Link
                    to={`/admin-dashboard/update-blog/${blog._id}`}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete && onDelete(blog._id, blog.blogTitle)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                No blogs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;