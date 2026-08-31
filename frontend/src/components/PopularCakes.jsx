import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "./CartContext";

function PopularCakes() {
  const { addToCart } = useCart();

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const categoryDetails = {
    Chocolate: {
      label: "CHOCOLATE COLLECTION",
      title: "Chocolate Cakes",
      description:
        "Rich, indulgent cakes crafted for true chocolate lovers.",
    },

    Classic: {
      label: "CLASSIC COLLECTION",
      title: "Classic Cakes",
      description:
        "Timeless favorites freshly baked for every sweet occasion.",
    },

    Premium: {
      label: "PREMIUM COLLECTION",
      title: "Premium Cakes",
      description:
        "Elegant cakes made with premium ingredients for memorable occasions.",
    },

    Fruit: {
      label: "FRUIT COLLECTION",
      title: "Fruit Cakes",
      description:
        "Fresh, creamy and fruity cakes made for a lighter sweet experience.",
    },
  };

  const currentCategory = selectedCategory
    ? categoryDetails[selectedCategory]
    : null;

  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Fetch cakes from backend
  useEffect(() => {
    fetch("/api/cakes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cakes");
        }

        return response.json();
      })
      .then((data) => {
  const filteredCakes = selectedCategory
    ? data.filter(
        (cake) => cake.category === selectedCategory
      )
    : data;

  setCakes(filteredCakes);
  setLoading(false);
})
      .catch((error) => {
        console.error(error);
        setError("Unable to load cakes");
        setLoading(false);
      });
  }, [selectedCategory]);

  // Category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Chocolate":
        return "🍫";

      case "Fruit":
        return "🍓";

      case "Premium":
        return "👑";

      case "Classic":
        return "🎂";

      default:
        return "🍰";
    }
  };

  // Toggle favorite
  const toggleFavorite = (cakeId) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(cakeId)) {
        return currentFavorites.filter((id) => id !== cakeId);
      }

      return [...currentFavorites, cakeId];
    });
  };

  // Loading state
  if (loading) {
    return (
      <section className="popular-cakes">
        <div className="section-heading">

  <div className="section-label">
    <span>✦</span>

    {currentCategory
      ? currentCategory.label
      : "CUSTOMER FAVORITES"}

    <span>✦</span>
  </div>

  <h2>
    {currentCategory ? (
      <>
        {currentCategory.title}
      </>
    ) : (
      <>
        Cakes Made With <span>Love</span>
      </>
    )}
  </h2>

  <p>
    {currentCategory
      ? currentCategory.description
      : "Discover our most loved cakes, freshly baked with premium ingredients and a whole lot of love."}
  </p>

</div>

        <div className="cake-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="cake-card skeleton-card" key={item}>
              <div className="skeleton-image"></div>

              <div className="skeleton-content">
                <div className="skeleton-line small"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line price"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="popular-cakes">
        <div className="cake-error">
          <div className="error-icon">🍰</div>

          <h3>Something went wrong</h3>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (cakes.length === 0) {
    return (
      <section className="popular-cakes">
        <div className="cake-empty">
          <div>🎂</div>

          <h3>No cakes available</h3>

          <p>
            Our bakers are preparing something delicious.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-cakes">

      {/* Section Heading */}
      <div className="section-heading">

        <div className="section-label">
          <span>✦</span>
          CUSTOMER FAVORITES
          <span>✦</span>
        </div>

        <h2>
          Cakes Made With <span>Love</span>
        </h2>

        <p>
          Discover our most loved cakes, freshly baked with premium
          ingredients and a whole lot of love.
        </p>

      </div>

    {selectedCategory && currentCategory && (
  <div className="active-category-info">
    <span>
      Showing {currentCategory.title}
    </span>

    <a href="/cakes">
      View all cakes
    </a>
  </div>
)}

      {/* Cake Grid */}
      <div className="cake-grid">

        {cakes.map((cake) => {

          const isFavorite = favorites.includes(cake.id);

          return (
            <article
              className="cake-card"
              key={cake.id}
            >

              {/* Image Section */}
              <div className="cake-image-wrapper">

                {/* Category Badge */}
                <div className="cake-badge">
                  <span>
                    {getCategoryIcon(cake.category)}
                  </span>

                  {cake.category}
                </div>


                {/* Favorite Button */}
                <button
                  type="button"
                  className={`favorite-button ${
                    isFavorite ? "active" : ""
                  }`}
                  onClick={() => toggleFavorite(cake.id)}
                  aria-label={
                    isFavorite
                      ? `Remove ${cake.name} from favorites`
                      : `Add ${cake.name} to favorites`
                  }
                >
                  {isFavorite ? "♥" : "♡"}
                </button>


                {/* Real Cake Image */}
                <div className="cake-image-ring">

                  <div className="cake-image-inner">

                    <img
                      src={cake.image}
                      alt={cake.name}
                      loading="lazy"
                    />

                  </div>

                </div>

              </div>


              {/* Cake Information */}
              <div className="cake-info">

                {/* Rating */}
                <div className="cake-rating">

                  <span className="stars">
                    ★★★★★
                  </span>

                  <span className="rating-number">
                    4.9
                  </span>

                </div>


                {/* Cake Name */}
                <h3>
                  {cake.name}
                </h3>


                {/* Real Description From Database */}
                <p className="cake-description">
                  {cake.description}
                </p>


                {/* Bottom Section */}
                <div className="cake-bottom">

                  {/* Price */}
                  <div className="cake-price">

                    <span>
                      Starting from
                    </span>

                    <strong>
                      ₹{Number(cake.price).toFixed(0)}
                    </strong>

                  </div>


                  {/* Add To Cart */}
                  <button
                    type="button"
                    className="add-cart-button"
                    onClick={() => addToCart(cake)}
                  >
                    <span>🛒</span>
                    Add to Cart
                  </button>

                </div>

              </div>

            </article>
          );
        })}

      </div>


      {/* View All Button */}
      <div className="view-all-container">

        <a
  href="/cakes"
  className="view-all-button"
>
  {selectedCategory ? "View All Cakes" : "Explore All Cakes"}
  <span>→</span>
</a>
      </div>

    </section>
  );
}

export default PopularCakes;