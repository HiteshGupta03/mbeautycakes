import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-tag">
          🎂 Freshly Baked
          <span>•</span>
          Delivered Fresh
        </div>

        <h1>
          Delicious Cakes
          <br />
          Made With{" "}
          <span className="hero-highlight">
            Love
          </span>{" "}
          <span className="hero-heart">♥</span>
        </h1>

        <p className="hero-description">
          Celebrate every special moment with
          delicious, freshly baked cakes crafted
          with premium ingredients and love.
        </p>

        <div className="hero-buttons">

          <Link
            to="/cakes"
            className="primary-btn"
          >
            Order Now
            <span>→</span>
          </Link>

          <a
            href="#categories"
            className="secondary-btn"
          >
            Explore Cakes
            <span>→</span>
          </a>

        </div>

        <div className="hero-features">

          <div className="hero-feature">
            <span>✓</span>
            <div>
              <strong>Freshly Baked</strong>
              <small>Made to order</small>
            </div>
          </div>

          <div className="hero-feature">
            <span>✓</span>
            <div>
              <strong>Premium Ingredients</strong>
              <small>Best quality</small>
            </div>
          </div>

          <div className="hero-feature">
            <span>✓</span>
            <div>
              <strong>Fast Delivery</strong>
              <small>To your doorstep</small>
            </div>
          </div>

        </div>

      </div>


      {/* RIGHT HERO VISUAL */}
      <div className="hero-image">

        {/* Background floating hearts */}
        <div className="hero-hearts-background" aria-hidden="true">

          <span className="hero-bg-heart hero-bg-heart-1">♥</span>
          <span className="hero-bg-heart hero-bg-heart-2">♥</span>
          <span className="hero-bg-heart hero-bg-heart-3">♥</span>
          <span className="hero-bg-heart hero-bg-heart-4">♥</span>
          <span className="hero-bg-heart hero-bg-heart-5">♥</span>
          <span className="hero-bg-heart hero-bg-heart-6">♥</span>
          <span className="hero-bg-heart hero-bg-heart-7">♥</span>
          <span className="hero-bg-heart hero-bg-heart-8">♥</span>

        </div>

        {/* Soft pink background */}
        <div className="hero-cake-background"></div>

        {/* Main Cake */}
        <div className="hero-cake-wrapper">
          <img
            src="/images/hero-cake.png"
            alt="Freshly baked chocolate cake"
            className="hero-cake"
          />
        </div>

      </div>

    </section>
  );
}

export default Hero;