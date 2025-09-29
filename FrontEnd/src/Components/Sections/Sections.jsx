import React from "react";
import { FaTv, FaTshirt, FaCouch } from "react-icons/fa";
import "./sections.css";

const Sections = () => {
  return (
    <section className="cards-section">
      <h2 className="section-title">Shop by Category</h2>
      <div className="cards-container">
        
        <div className="card">
          <FaTv className="card-icon" />
          <h3>Electronics</h3>
          <p>Latest devices and modern technology at your fingertips.</p>
        </div>

        <div className="card">
          <FaTshirt className="card-icon" />
          <h3>Clothing</h3>
          <p>Trendy fashion that suits every style and occasion.</p>
        </div>

        <div className="card">
          <FaCouch className="card-icon" />
          <h3>Furniture</h3>
          <p>Elegant furniture and decor to style your home.</p>
        </div>

      </div>
    </section>
  );
};

export default Sections;
