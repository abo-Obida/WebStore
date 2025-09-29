import "../Style/Dashboard.css";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]); 

  useEffect(() => {
    // ✅ Get orders
    fetch("http://localhost:8000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrdersCount(data.length);

        const sales = data.reduce((acc, order) => acc + order.total, 0);
        setTotalSales(sales);

        setRecentOrders(data.slice(-5).reverse());

        // ✅ Group by month
        const monthly = {};
        data.forEach((order) => {
          const date = new Date(order.createdAt);
          const month = date.toLocaleString("en-US", { month: "short" }); 
          monthly[month] = (monthly[month] || 0) + order.total;
        });

        // ✅ Format for recharts
        const formatted = Object.keys(monthly).map((month) => ({
          month,
          sales: monthly[month],
        }));

        setMonthlySales(formatted);
      })
      .catch((err) => console.error("Error fetching orders:", err));

    // ✅ Get users
    fetch("http://localhost:8000/api/users")
      .then((res) => res.json())
      .then((data) => setUsersCount(data.length))
      .catch((err) => console.error("Error fetching users:", err));

    // ✅ Get products (for category share)
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const categoryCount = data.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});
        const formatted = Object.keys(categoryCount).map((key) => ({
          name: key,
          value: categoryCount[key],
        }));
        setCategoryData(formatted);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">ShopEase</h2>
        <ul>
          
          <li>
            <NavLink to="/admin/products">
              <FaBox className="icon" /> Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders">
              <FaShoppingCart className="icon" /> Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <FaUsers className="icon" /> Users
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/admin/settings">
              <FaCog className="icon" /> Settings
            </NavLink>
          </li> */}
        </ul>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <h1>Admin Dashboard</h1>
          <input type="text" placeholder="Search..." className="search" />
        </header>

        {/* Cards */}
        <section className="cards">
          <div className="card">
            <h3>Total Sales</h3>
            <p>${totalSales}</p>
          </div>
          <div className="card">
            <h3>Orders</h3>
            <p>{ordersCount}</p>
          </div>
          <div className="card">
            <h3>Users</h3>
            <p>{usersCount}</p>
          </div>
        </section>

        {/* Charts */}
        <section className="charts">
          {/* ✅ Line Chart */}
          <div className="chart">
            <h3>Monthly Sales</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="chart">
            <h3>Category Share</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="table">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customer}</td>
                  <td>{order.status}</td>
                  <td>${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
