function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🎂",
      title: "Choose Your Cake",
      description:
        "Explore our collection and find the perfect cake for your celebration.",
    },
    {
      number: "02",
      icon: "🛒",
      title: "Place Your Order",
      description:
        "Select your cake, choose your preferred quantity, and add it to your cart.",
    },
    {
      number: "03",
      icon: "👩‍🍳",
      title: "We Bake Fresh",
      description:
        "Our bakers prepare your cake fresh using premium ingredients and lots of care.",
    },
    {
      number: "04",
      icon: "🚚",
      title: "Fast Delivery",
      description:
        "Your freshly baked cake is carefully packed and delivered to your doorstep.",
    },
  ];

  return (
    <section
  className="how-it-works"
  id="how-it-works"
        >
      {/* Heading */}
      <div className="how-heading">
        <div className="how-label">
          <span>✦</span>
          HOW IT WORKS
          <span>✦</span>
        </div>

        <h2>
          From Our Oven
          <em> To Your Door</em>
        </h2>

        <p>
          Ordering your perfect cake is simple, convenient, and
          made with love.
        </p>
      </div>

      {/* Steps */}
      <div className="how-steps">
        {steps.map((step, index) => (
          <div className="how-step" key={step.number}>
            {/* Number */}
            <div className="step-number">{step.number}</div>

            {/* Icon */}
            <div className="step-icon">
              {step.icon}
            </div>

            {/* Content */}
            <div className="step-content">
              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="step-connector">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;