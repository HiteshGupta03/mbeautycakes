import { Link } from "react-router-dom";

const categories = [
  {
    title: "Wedding Cakes",
    description: "Elegant cakes made for your special day",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
    icon: "💍",
    filter: "Premium",
  },

  {
    title: "Birthday Cakes",
    description: "Make every birthday extra special",
    image:
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",
    icon: "🎂",
    filter: "Classic",
  },

  {
    title: "Chocolate Cakes",
    description: "Rich, indulgent and freshly baked",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    icon: "🍫",
    filter: "Chocolate",
  },

  {
    title: "Custom Cakes",
    description: "Bring your dream cake to life",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=85",
    icon: "🎨",
    filter: "Premium",
  },
];

function Categories() {
  return (
    <section
  className="categories-section"
  id="categories"
>

      {/* Heading */}
      <div className="categories-heading">

        <span className="categories-label">
          ✦ EXPLORE OUR COLLECTION ✦
        </span>

        <h2>
          Find Your Perfect <em>Cake</em>
        </h2>

        <p>
          From elegant celebrations to everyday sweet moments,
          discover a cake made just for you.
        </p>

      </div>


      {/* Categories */}
      <div className="categories-grid">

        {categories.map((category) => (

          <article
            className="category-card"
            key={category.title}
          >

            {/* Image */}
            <div className="category-image">

              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
              />

              <div className="category-icon">
                {category.icon}
              </div>

            </div>


            {/* Content */}
            <div className="category-content">

              <h3>
                {category.title}
              </h3>

              <p>
                {category.description}
              </p>

              <Link
                  to={`/cakes?category=${category.filter}`}
                  className="category-explore-button"
                  >
                Explore Cakes
                <span>→</span>
              </Link>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}

export default Categories;