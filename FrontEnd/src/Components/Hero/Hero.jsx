import "./Hero.css";
import image from "../../assets/image_Hero.svg"
import { NavLink } from "react-router-dom";
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>shop easily & safely </h1>
        <p>
          dicover the best products with the best prices, fast delivery service 24/7 in your favorite store  
        </p>
        <div className="hero-buttons">
          <button className="btn primary">
            <NavLink to="/Products">

            shop now
            </NavLink>
            </button>
          <button className="btn secondary">read more </button>
        </div>
      </div>
      <div className="hero-image">
        <img
          src={image}
          alt="Online Shopping"
        />
      </div>
    </section>
  );
};

export default Hero;
