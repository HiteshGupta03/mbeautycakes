import { Link } from "react-router-dom";
import "./BestSeller.css";

const bestSellerImage =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85";

function BestSeller() {
  return (
    <section className="best-seller-section">

      <div className="best-seller-heading">

        <div className="best-seller-label">
          <span>✦</span>
          TASTE THE BEST
          <span>✦</span>
        </div>

        <h2>
          Best Seller <em>Of The Week</em>
        </h2>

        <p>
          The cake our customers keep coming back for —
          rich, indulgent and freshly baked with love.
        </p>

      </div>


      <div className="best-seller-card">

        <div className="best-seller-image-area">

          <div className="best-seller-glow"></div>

          <div className="best-seller-image-ring">
            <img
              src={bestSellerImage}
              alt="Chocolate Truffle Cake"
            />
          </div>

          <div className="best-seller-badge">
            ⭐ Customer Favourite
          </div>

        </div>


        <div className="best-seller-content">

          <span className="best-seller-eyebrow">
            ⭐ 4.9 / 5 • Most Loved
          </span>

          <h3>
            Chocolate Truffle Cake
          </h3>

          <p>
            A rich chocolate cake layered with smooth
            chocolate cream and finished with a decadent
            chocolate drip. Perfect for birthdays,
            celebrations and every sweet craving.
          </p>


          <div className="best-seller-highlights">

            <div>
              <span>🍫</span>
              <div>
                <strong>Rich Chocolate</strong>
                <small>Premium cocoa</small>
              </div>
            </div>

            <div>
              <span>🎂</span>
              <div>
                <strong>Freshly Baked</strong>
                <small>Made to order</small>
              </div>
            </div>

            <div>
              <span>❤️</span>
              <div>
                <strong>Customer Favourite</strong>
                <small>Highly rated</small>
              </div>
            </div>

          </div>


          <div className="best-seller-bottom">

            <div className="best-seller-price">
              <small>STARTING FROM</small>
              <strong>₹699</strong>
            </div>

            <Link
              to="/cakes"
              className="best-seller-button"
            >
              Order Now
              <span>→</span>
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default BestSeller;