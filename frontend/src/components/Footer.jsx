import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      
      setTimeout(() => {
        const section =
          document.getElementById(sectionId);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);

      return;
    }

    const section =
      document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSectionClick = (
    event,
    sectionId
  ) => {
    event.preventDefault();

    scrollToSection(sectionId);
  };

  return (
    <footer className="site-footer">

      <div className="footer-main">

        {/* =====================================
            BRAND
        ===================================== */}

        <div className="footer-brand">

          <div className="footer-logo">
            <span>🍰</span>
            <h2>MbeautyCakes</h2>
          </div>

          <p>
            Freshly baked cakes made with love,
            premium ingredients, and a little
            sweetness for every celebration.
          </p>

          <div className="footer-socials">

            <a
              href="#"
              aria-label="Instagram"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              ◎
            </a>

            <a
              href="#"
              aria-label="Facebook"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              f
            </a>

            <a
              href="#"
              aria-label="Twitter"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              𝕏
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              ◉
            </a>

          </div>

        </div>


        {/* =====================================
            QUICK LINKS
        ===================================== */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>


          {/* Home */}

          <Link to="/">
            Home
          </Link>


          {/* About Us */}

          <a
            href="/#why-us"
            onClick={(event) =>
              handleSectionClick(
                event,
                "why-us"
              )
            }
          >
            About Us
          </a>


          {/* Our Cakes */}

          <Link to="/cakes">
            Our Cakes
          </Link>


          {/* Categories */}

          <a
            href="/#categories"
            onClick={(event) =>
              handleSectionClick(
                event,
                "categories"
              )
            }
          >
            Categories
          </a>


          {/* Contact */}

          <a
            href="#contact"
            onClick={(event) =>
              handleSectionClick(
                event,
                "contact"
              )
            }
          >
            Contact
          </a>

        </div>


        {/* =====================================
            CAKE CATEGORIES
        ===================================== */}

        <div className="footer-column">

          <h3>
            Cake Categories
          </h3>


          <Link
            to="/cakes?category=Chocolate"
          >
            Chocolate Cakes
          </Link>


          <Link
            to="/cakes?category=Fruit"
          >
            Fruit Cakes
          </Link>


          <Link
            to="/cakes?category=Classic"
          >
            Classic Cakes
          </Link>


          <Link
            to="/cakes?category=Premium"
          >
            Premium Cakes
          </Link>


          <Link to="/cakes">
            All Cakes
          </Link>

        </div>


        {/* =====================================
            CONTACT
        ===================================== */}

        <div
          className="footer-column footer-contact"
          id="contact"
        >

          <h3>
            Get In Touch
          </h3>

          <p>
            <span>📍</span>
            Mumbai, Maharashtra
          </p>

          <p>
            <span>📞</span>
            +91 98765 43210
          </p>

          <p>
            <span>✉</span>
            hello@mbeautycakes.com
          </p>

          <p>
            <span>🕐</span>
            Mon – Sun: 9 AM – 9 PM
          </p>

        </div>

      </div>


      {/* =====================================
          FOOTER BOTTOM
      ===================================== */}

      <div className="footer-bottom">

        <p>
          © 2026 MbeautyCakes.
          All rights reserved.
        </p>

        <div className="footer-bottom-links">

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            Privacy Policy
          </a>

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            Terms & Conditions
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;