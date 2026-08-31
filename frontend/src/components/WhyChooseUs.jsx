function WhyChooseUs() {
  const benefits = [
    {
      icon: "🎂",
      title: "Freshly Baked",
      description:
        "Every cake is freshly prepared to give you the best taste and quality.",
    },
    {
      icon: "✦",
      title: "Premium Quality",
      description:
        "We use carefully selected ingredients to create cakes you'll love.",
    },
    {
      icon: "♡",
      title: "Made With Love",
      description:
        "Every cake is crafted with care, passion, and attention to detail.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description:
        "We make sure your cake reaches you fresh, safe, and right on time.",
    },
    {
      icon: "🎁",
      title: "Beautifully Packed",
      description:
        "Your cake is carefully packed so it arrives looking as beautiful as it tastes.",
    },
    {
      icon: "★",
      title: "Customer Happiness",
      description:
        "Your happiness matters to us, from the first order to the final bite.",
    },
  ];

  return (
    <section className="why-choose-us">
      {/* Heading */}
      <div className="why-heading">
        <div className="why-label">
          <span>✦</span>
          WHY CHOOSE US
          <span>✦</span>
        </div>

        <h2>
          More Than Just
          <em> A Cake</em>
        </h2>

        <p>
          We believe every celebration deserves something
          delicious, beautiful, and made with care.
        </p>
      </div>

      {/* Benefits */}
      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <article
            className="benefit-card"
            key={benefit.title}
          >
            <div className="benefit-icon">
              {benefit.icon}
            </div>

            <div className="benefit-content">
              <h3>{benefit.title}</h3>

              <p>{benefit.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;