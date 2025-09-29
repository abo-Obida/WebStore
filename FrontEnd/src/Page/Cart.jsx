import { useEffect, useState } from "react";
import axios from "axios";
import "../Style/cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCart(res.data);
      } catch (err) {
        console.error("❌ Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(cart.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error("❌ Error removing item:", err);
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    try {
      await axios.put(
        `http://localhost:8000/api/cart/${productId}`,
        { qty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCart(
        cart.map((item) =>
          item.product._id === productId ? { ...item, qty } : item
        )
      );
    } catch (err) {
      console.error("❌ Error updating qty:", err);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <section className="cart">
        <div className="empty-cart">
          <h3>🛒 Your Cart is Empty</h3>
          <p>Browse products and add them to your cart.</p>
        </div>
      </section>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  return (
    <section className="cart">
      <div className="cart-header">
        <h2>🛒 Your Cart</h2>
        <p>{cart.length} items</p>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.product._id}>
            <div className="item-image">
              <img src={item.product.image} alt={item.product.name} />
            </div>
            <div className="item-info">
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p>{item.product.desc}</p>
              </div>
              <p className="item-price">${item.product.price}</p>
              <div className="qty">
                <button
                  onClick={() => updateQty(item.product._id, item.qty - 1)}
                  disabled={item.qty <= 1}
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.product._id, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.product._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="summary">
        <div className="summary-card">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>
          <div className="summary-line">
            <span>Total</span>
            <span className="summary-total">${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </aside>
    </section>
  );
};

export default Cart;
