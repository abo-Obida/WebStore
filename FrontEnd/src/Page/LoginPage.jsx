import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ ربط بالـ Context
import image from "../assets/login.svg";
import "../Style/login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ جلب login من AuthContext

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (isLogin) {
      if (!form.email || !form.password) {
        toast.error("Please enter Email and Password!");
        return;
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        toast.error("Please fill all fields!");
        return;
      }
    }

    try {
      const url = isLogin
        ? "http://localhost:8000/api/users/login"
        : "http://localhost:8000/api/users/register";

      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isLogin ? "Logged in successfully 🎉" : "Account created successfully 🚀");

        if (data.token && data.user) {
          // ✅ استخدام الـ context بدل التخزين اليدوي
          login(data.token, data.user);
        }

        // التوجيه حسب الدور
        const role = data.user?.role;
        if (role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || (isLogin ? "Login failed" : "Sign Up failed"));
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="login-page">
      {/* Left Section: Form */}
      <div className="login-form">
        <div className="tabs">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Sign Up
          </button>
        </div>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Google Login */}
        <button
          type="button"
          className="google-btn"
          onClick={() => toast.success("Google Login Coming Soon 🚀")}
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google Icon" />
          {isLogin ? "Login with Google" : "Sign Up with Google"}
        </button>
      </div>

      {/* Right Section: Image */}
      <div className="login-image">
        <img src={image} alt="Illustration" />
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
