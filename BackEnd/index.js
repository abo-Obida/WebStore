import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Routes
import userRoutes from "./Routers/userRoutes.js";
import productRoutes from "./Routers/productRoutes.js";
import orderRoutes from "./Routers/orderRoutes.js";
import cartRoutes from "./Routers/cartRoutes.js";


const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
// MongoDB connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};

// Start server
app.listen(port, () => {
  connect();
  console.log("🚀 Server running on port", port);
});
