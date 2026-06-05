import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Categories = () => {
  const { id } = useParams();
  const backendUrl = useSelector((state) => state.prod.link);
  const [blogs, setBlogs] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogsByCategory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/blogs?category=${id}`);
        setBlogs(res.data.blogs);
        if (res.data.blogs.length > 0) {
          setCategoryName(res.data.blogs[0].category.name);
        } else {
          // fetch category name separately
          const catRes = await axios.get(`${backendUrl}/api/categories/${id}`);
          setCategoryName(catRes.data.name);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogsByCategory();
  }, [id, backendUrl]);

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Category: {categoryName}</h2>
      {blogs.length === 0 ? (
        <p>No blogs in this category yet.</p>
      ) : (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-md-6 col-lg-4" key={blog._id}>
              <div className="card h-100 shadow-sm">
                <img src={`${backendUrl}${blog.blogImage}`} className="card-img-top" alt={blog.blogTitle} />
                <div className="card-body">
                  <h5 className="card-title">{blog.blogTitle}</h5>
                  <p className="card-text">{blog.blogDescription.substring(0, 80)}...</p>
                  <Link to={`/description/${blog._id}`} className="btn btn-primary">Read More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;