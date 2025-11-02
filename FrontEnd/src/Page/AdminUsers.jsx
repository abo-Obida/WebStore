import "../Style/AdminUsers.css";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user._id !== id));
      toast.success(` User ${name} deleted!`);
    } catch (error) {
      toast.error(" Error deleting user");
    }
  };

  const handleStatusToggle = async (id, currentStatus, name) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
      toast.success(`✅ ${name} status updated to ${newStatus}`);
    } catch (error) {
      toast.error("❌ Error updating status");
    }
  };

  return (
    <div className="admin-users">
      <Toaster position="top-right" />
      <h2>Manage Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="status-btn"
                  onClick={() =>
                    handleStatusToggle(user._id, user.status, user.name)
                  }
                >
                  {user.status === "Active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id, user.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
