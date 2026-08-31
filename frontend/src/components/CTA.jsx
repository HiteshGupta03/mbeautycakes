import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-decoration cta-decoration-left"></div>
      <div className="cta-decoration cta-decoration-right"></div>

      <div className="cta-content">
        <span className="cta-label">
          ✦ MADE WITH LOVE ✦
        </span>

        <h2>
          Ready to Make Someone's Day
          <em> Sweeter?</em>
        </h2>

        <p>
          From birthdays to special celebrations,
          find the perfect cake freshly baked just for you.
        </p>

        <div className="cta-buttons">

          <a
            href="/#categories"
            className="cta-primary"
          >
            Explore Cakes
            <span>→</span>
          </a>

          <Link
            to="/cakes"
            className="cta-secondary"
          >
            Order Now
            <span>♡</span>
          </Link>

        </div>

        <div className="cta-features">
          <span>✓ Freshly Baked</span>
          <span>✓ Premium Ingredients</span>
          <span>✓ Fast Delivery</span>
        </div>
      </div>
    </section>
  );
}

export default CTA;