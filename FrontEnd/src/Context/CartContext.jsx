// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

// ✅ إنشاء الكونتكست
const CartContext = createContext();

// ✅ هوك لاستخدام الكارت بسهولة
export const useCart = () => useContext(CartContext);

// ✅ المزود (Provider) المسؤول عن إدارة السلة
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // 🛒 السلة

  // ➕ إضافة منتج للسلة
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        // لو المنتج موجود زيد الكمية
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      // لو أول مرة ينضاف
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ❌ إزالة منتج من السلة
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // 🔄 تحديث الكمية
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};
