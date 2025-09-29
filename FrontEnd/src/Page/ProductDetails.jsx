import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Style/ProductDetails.css";
import toast, { Toaster } from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // ✅ جلب المنتج من الـ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // ✅ إضافة للسلة
  const addToCart = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/cart",
        { productId: product._id, qty: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // التوكن من login
          },
        }
      );
      toast.success(" Added to cart!")
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      toast.error("Error adding to cart")
    }
  };

  return (
    <div className="product-details">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="desc">{product.desc}</p>
        <p className="price">${product.price}</p>
        <button className="add-btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
