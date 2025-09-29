import "../Style/AdminOrder.css";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending"
        ? "Shipped"
        : currentStatus === "Shipped"
        ? "Delivered"
        : currentStatus;

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`✅ Order ${id} status updated to ${newStatus}`);
    } catch (error) {
      toast.error("❌ Error updating order status");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      setOrders(orders.filter((order) => order._id !== id));
      toast.success(`🗑️ Order ${id} deleted!`);
    } catch (error) {
      toast.error("❌ Error deleting order");
    }
  };

  return (
    <div className="admin-orders">
      <Toaster position="top-right" />
      <h2>Manage Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customer}</td>
              <td>{order.status}</td>
              <td>${order.total}</td>
              <td>
                {order.status !== "Delivered" && (
                  <button
                    className="update-btn"
                    onClick={() =>
                      handleStatusChange(order._id, order.status)
                    }
                  >
                    {order.status === "Pending" ? "Ship" : "Deliver"}
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(order._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
