import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Categories = () => {
  const backendUrl = useSelector((state) => state.prod.link);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  if (loading) return <div className="text-center py-4">Loading categories...</div>;
  if (categories.length === 0) return null;

  return (
    <section className="container my-5">
      <h2 className="fw-bold mb-4 text-center">Browse by Category</h2>
      <div className="d-flex justify-content-center flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/categories/${cat._id}`}
            className="btn btn-outline-primary rounded-pill px-4 py-2"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;