import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be positive"],
    },
    category: {
      type: String,
      enum: ["electronics", "clothes", "furniture"],
      required: [true, "Category is required"],
    },
    image: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true } 
);

const Product = mongoose.model("Product", productSchema);

export default Product;
