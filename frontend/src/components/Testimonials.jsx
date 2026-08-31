function Testimonials() {
  const testimonials = [
    {
      name: "Priya S.",
      location: "Mumbai",
      rating: 5,
      review:
        "The cake was absolutely delicious! It looked beautiful and tasted even better. Everyone at the celebration loved it.",
      initial: "P",
    },
    {
      name: "Rahul M.",
      location: "Mumbai",
      rating: 5,
      review:
        "Beautifully packed and delivered fresh. The cake was exactly what I ordered and the quality was excellent.",
      initial: "R",
    },
    {
      name: "Sneha K.",
      location: "Mumbai",
      rating: 5,
      review:
        "Everyone loved the cake! It was fresh, soft, and beautifully made. I will definitely order again.",
      initial: "S",
    },
  ];

  return (
    <section className="testimonials">
      {/* Heading */}
      <div className="testimonials-heading">
        <div className="testimonials-label">
          <span>✦</span>
          WHAT OUR CUSTOMERS SAY
          <span>✦</span>
        </div>

        <h2>
          Sweet Words From
          <em> Happy Customers</em>
        </h2>

        <p>
          Every order means a lot to us. Here's what some of our
          customers have to say about their experience.
        </p>
      </div>

      {/* Reviews */}
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article
            className="testimonial-card"
            key={testimonial.name}
          >
            {/* Rating */}
            <div className="testimonial-rating">
              {"★".repeat(testimonial.rating)}
            </div>

            {/* Quote */}
            <div className="testimonial-quote">
              “
            </div>

            <p className="testimonial-review">
              {testimonial.review}
            </p>

            {/* Customer */}
            <div className="testimonial-customer">
              <div className="customer-avatar">
                {testimonial.initial}
              </div>

              <div>
                <h3>{testimonial.name}</h3>
                <span>{testimonial.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;