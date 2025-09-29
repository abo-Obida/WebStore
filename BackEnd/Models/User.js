import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // ربط بالمنتجات
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false } // ما نحتاج id لكل عنصر cart
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Customer"],
      default: "Customer",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // 🛒 Cart لكل مستخدم
    cart: [cartItemSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
