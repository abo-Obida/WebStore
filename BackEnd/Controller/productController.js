import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { desc: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("📩 BODY:", req.body);
    console.log("📷 FILE:", req.file);

    const { name, desc, price, category } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, price and category are required" });
    }

    let imageUrl = "";

    if (req.file) {
      console.log(" Uploading to Cloudinary...");

      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) {
                console.error(" Cloudinary Error:", error);
                reject(error);
              } else {
                console.log(" Cloudinary Upload Success:", result.secure_url);
                resolve(result);
              }
            }
          );
          stream.end(req.file.buffer);
        });

        imageUrl = result.secure_url;
      } catch (err) {
        console.error(" Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Cloudinary upload failed", error: err });
      }
    }

    const product = new Product({
      name,
      desc,
      price,
      category,
      image: imageUrl,
    });

    const savedProduct = await product.save();
    console.log(" Product Saved:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(" General Error:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log("Updating product with body:", req.body, "and file:", req.file);

    const { name, desc, price, category } = req.body;
    let updatedData = { name, desc, price, category };

    if (req.file) {
      try {
        const imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });
        updatedData.image = imageUrl;
      } catch (cloudErr) {
        console.error("Cloudinary upload error on update:", cloudErr);
        return res.status(500).json({ message: "Cloudinary upload failed", error: cloudErr });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};
