import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import "./header.css";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <a href="/">ShopEase</a>
      </div>

      {/* Desktop Nav */}
      <nav className="desktop-nav">
        {/* Products → static text */}
        <span className="disabled-link">
          <NavLink to="/Products">Products</NavLink>
        </span>

        <a
          href="https://wa.me/0997855951"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact
        </a>

        <a href="/cart" className="cart-link">
          <FaShoppingCart /> <span className="cart-badge">3</span>
        </a>

        {!isAuthenticated ? (
          <a href="/login" className="btn login">
            Login
          </a>
        ) : (
          <button className="btn logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>

      {/* Mobile Toggle */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="mobile-menu">
          <li>
            <span className="disabled-link" onClick={() => setMenuOpen(false)}>
              <NavLink to="/Products">Products</NavLink>
            </span>
          </li>
          <li>
            <a
              href="https://wa.me/0997855951"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </li>
          <li>
            <a href="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </a>
          </li>
          {!isAuthenticated ? (
            <li>
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn login"
              >
                Login
              </a>
            </li>
          ) : (
            <li>
              <button onClick={handleLogout} className="btn logout">
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </header>
  );
};

export default Header;
