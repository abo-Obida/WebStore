import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo / Store Name */}
        <div className="footer-logo">
          <h2>ShopEase</h2>
          <p>Your trusted online shopping partner.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>

        {/* Signature */}
        <div className="footer-signature">
          <p>Designed by <span>Eng. Abdulrahman Al Samra</span></p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
