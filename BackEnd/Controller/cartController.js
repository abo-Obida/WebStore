import User from "../models/User.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);

    const item = user.cart.find((i) => i.product.toString() === productId);
    if (item) {
      item.qty += qty || 1;
    } else {
      user.cart.push({ product: productId, qty: qty || 1 });
    }

    await user.save();
    res.status(201).json(user.cart);
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    const item = user.cart.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.qty = qty;
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error("❌ Error updating cart:", err);
    res.status(500).json({ message: "Error updating cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error("❌ Error removing from cart:", err);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
