import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BlogCard from "../BlogCard/BlogCard";

const Favourites = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        // For now, fetch all blogs – replace with a dedicated favourites endpoint when available
        const res = await axios.get(`${backendUrl}/api/blogs`, {
          withCredentials: false,
        });
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch favourite blogs:", err);
        setError("Could not load favourite blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mx-3">{error}</div>
    );
  }

  return (
    <div className="container my-5">
      <h2
        className="text-center fw-bold mb-5"
        style={{ color: "#171819" }}
      >
        Favourite Blogs
      </h2>

      {blogs.length === 0 ? (
        <div className="text-center text-muted">
          No favourite blogs yet. Start adding some!
        </div>
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

export default Favourites;