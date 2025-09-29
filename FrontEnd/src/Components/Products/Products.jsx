import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ جلب المنتجات من API
  const fetchProducts = async (query = "") => {
    try {
      const res = await axios.get(`http://localhost:8000/api/products?search=${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // ✅ أول مرة يفتح الكومبوننت
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ البحث مع تأخير 500ms
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <section className="products-section">
      <h2 className="section-title">Products</h2>

      {/* 🔍 مربع البحث */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* عرض المنتجات */}
      <div className="products-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
              <span className="price">${product.price}</span>
              <button
                className="btn"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                View Product
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No products found ❌
          </p>
        )}
      </div>
    </section>
  );
};

export default Products;
