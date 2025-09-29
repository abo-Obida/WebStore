import "../Style/AdminProducts.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "http://localhost:8000/api";

const AdminProducts = () => {
  const [tab, setTab] = useState("manage");
  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (error) {
      toast.error("Error fetching products");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  // Handle add/edit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || (!imageFile && !editingId)) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("desc", form.desc);
      formData.append("category", form.category);
      if (imageFile) formData.append("image", imageFile);

      if (editingId) {
        await axios.put(`${API_BASE}/products/${editingId}`, formData);
        toast.success("✅ Product updated successfully!");
      } else {
        await axios.post(`${API_BASE}/products`, formData);
        toast.success("✅ Product added successfully!");
      }

      fetchProducts();
      setForm({ name: "", price: "", desc: "", category: "" });
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      setTab("manage");
    } catch (error) {
      toast.error("Error saving product");
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      toast.success("🗑️ Product deleted!");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setTab("add");
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      desc: product.desc,
      category: product.category,
    });
    setImagePreview(product.image);
  };

  return (
    <div className="admin-products">
      <Toaster position="top-right" />

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "manage" ? "active" : ""}
          onClick={() => setTab("manage")}
        >
          Manage Products
        </button>
        <button
          className={tab === "add" ? "active" : ""}
          onClick={() => {
            setTab("add");
            setEditingId(null);
            setForm({ name: "", price: "", desc: "", category: "" });
            setImageFile(null);
            setImagePreview(null);
          }}
        >
          {editingId ? "Edit Product" : "Add Product"}
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {tab === "manage" && (
          <div>
            <h2>Manage Products</h2>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.image} alt={p.name} className="table-img" />
                    </td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>{p.category}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "add" && (
          <div>
            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form className="add-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
              />
              <textarea
                name="desc"
                placeholder="Description"
                value={form.desc}
                onChange={handleChange}
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothes">Clothes</option>
                <option value="furniture">Furniture</option>
              </select>

              <div className="image-upload">
                <label htmlFor="product-image" className="upload-label">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="preview-img" />
                  ) : (
                    "Upload Product Image"
                  )}
                </label>
                <input
                  type="file"
                  id="product-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              <button type="submit">{editingId ? "Update Product" : "Save Product"}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
