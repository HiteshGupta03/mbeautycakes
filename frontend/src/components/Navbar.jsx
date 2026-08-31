import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useCart } from "./CartContext";
import "./Navbar.css";

function Navbar() {
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState("home");
  const [pendingSection, setPendingSection] =
    useState(null);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState(null);

  const location = useLocation();
  const navigate = useNavigate();


  /* =========================================
     CART COUNT
  ========================================= */

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );


  /* =========================================
     LOAD CURRENT USER
  ========================================= */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      setCurrentUser(null);
      return;
    }

    try {
      setCurrentUser(
        JSON.parse(storedUser)
      );
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      setCurrentUser(null);
    }
  }, [location.pathname]);


  /* =========================================
     CLOSE MENU
  ========================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };


  /* =========================================
     CLOSE PROFILE
  ========================================= */

  const closeProfile = () => {
    setProfileOpen(false);
  };


  /* =========================================
     SCROLL TO SECTION
  ========================================= */

  const scrollToSection = (sectionId) => {
    const section =
      document.getElementById(
        sectionId
      );

    if (!section) {
      return;
    }

    const navbarHeight =
      window.innerWidth <= 650
        ? 68
        : 78;

    const sectionTop =
      section.getBoundingClientRect()
        .top +
      window.scrollY -
      navbarHeight;

    window.scrollTo({
      top: Math.max(
        sectionTop,
        0
      ),
      behavior: "smooth",
    });
  };


  /* =========================================
     HOME NAVIGATION
  ========================================= */

  const handleHomeNavigation = (
    event
  ) => {
    event.preventDefault();

    closeMenu();
    closeProfile();

    setPendingSection(null);

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      window.history.replaceState(
        null,
        "",
        "/"
      );

      setActiveSection("home");

      return;
    }

    navigate("/");
  };


  /* =========================================
     SECTION NAVIGATION
  ========================================= */

  const handleSectionNavigation = (
    sectionId
  ) => {
    closeMenu();
    closeProfile();

    if (location.pathname === "/") {
      scrollToSection(sectionId);

      window.history.replaceState(
        null,
        "",
        "/"
      );

      return;
    }

    setPendingSection(sectionId);

    navigate("/");
  };


  /* =========================================
     SCROLL AFTER ROUTE CHANGE
  ========================================= */

  useEffect(() => {
    if (
      location.pathname !== "/" ||
      !pendingSection
    ) {
      return;
    }

    const sectionId =
      pendingSection;

    const timer = setTimeout(() => {
      scrollToSection(sectionId);

      window.history.replaceState(
        null,
        "",
        "/"
      );

      setPendingSection(null);
    }, 80);

    return () => {
      clearTimeout(timer);
    };
  }, [
    location.pathname,
    pendingSection,
  ]);


  /* =========================================
     ACTIVE SECTION ON SCROLL
  ========================================= */

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const sections = [
      {
        id: "home",
        element:
          document.querySelector(
            ".hero"
          ),
      },

      {
        id: "cakes",
        element:
          document.querySelector(
            "#our-menu"
          ),
      },

      {
        id: "how-it-works",
        element:
          document.querySelector(
            "#how-it-works"
          ),
      },
    ].filter(
      (section) =>
        section.element
    );

    if (sections.length === 0) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleSections =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (
            visibleSections.length === 0
          ) {
            return;
          }

          const sectionId =
            visibleSections[0]
              .target
              .dataset
              .navSection;

          if (sectionId) {
            setActiveSection(
              sectionId
            );
          }
        },
        {
          root: null,

          rootMargin:
            "-30% 0px -50% 0px",

          threshold: [
            0,
            0.1,
            0.25,
            0.5,
            0.75,
            1,
          ],
        }
      );

    sections.forEach((section) => {
      section.element.dataset.navSection =
        section.id;

      observer.observe(
        section.element
      );
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);


  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setProfileOpen(false);
    setMenuOpen(false);

    navigate("/login");
  };


  /* =========================================
     PROFILE INITIAL
  ========================================= */

  const profileInitial =
    currentUser?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";


  /* =========================================
     RENDER
  ========================================= */

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={
            handleHomeNavigation
          }
        >
          <span className="logo-icon">
            🎂
          </span>

          <span>
            MbeautyCakes
          </span>
        </Link>


        {/* =====================================
            DESKTOP NAVIGATION
        ===================================== */}

        <div className="navbar-links">

          {/* HOME */}

          <a
            href="/"
            className={
              location.pathname === "/" &&
              activeSection === "home"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={
              handleHomeNavigation
            }
          >
            Home
          </a>


          {/* CAKES */}

          <a
            href="/cakes"
            className={
              location.pathname ===
                "/cakes" ||
              (
                location.pathname === "/" &&
                activeSection === "cakes"
              )
                ? "nav-link active"
                : "nav-link"
            }
            onClick={(event) => {
              event.preventDefault();

              if (
                location.pathname === "/"
              ) {
                handleSectionNavigation(
                  "our-menu"
                );
              } else {
                closeMenu();
                closeProfile();

                navigate("/cakes");
              }
            }}
          >
            Cakes
          </a>


          {/* HOW IT WORKS */}

          <a
            href="/#how-it-works"
            className={
              location.pathname === "/" &&
              activeSection ===
                "how-it-works"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={(event) => {
              event.preventDefault();

              handleSectionNavigation(
                "how-it-works"
              );
            }}
          >
            How It Works
          </a>


          {/* ORDERS */}

          <NavLink
            to="/orders"
            onClick={closeProfile}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Orders
          </NavLink>


          {/* LOGIN */}

          <NavLink
            to="/login"
            onClick={closeProfile}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Login
          </NavLink>


          {/* REGISTER */}

          <NavLink
            to="/register"
            onClick={closeProfile}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Register
          </NavLink>


          {/* CART */}

          <NavLink
            to="/cart"
            onClick={closeProfile}
            className={({ isActive }) =>
              isActive
                ? "nav-link cart-link active"
                : "nav-link cart-link"
            }
          >
            <span>🛒</span>

            Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </NavLink>


          {/* =================================
              DESKTOP PROFILE
          ================================= */}

          <div className="profile-wrapper">

            <button
              type="button"
              className={`profile-button ${
                profileOpen
                  ? "open"
                  : ""
              }`}
              onClick={() => {
                setProfileOpen(
                  (previous) =>
                    !previous
                );

                setMenuOpen(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={
                profileOpen
              }
            >

              <span className="profile-avatar">
                {currentUser
                  ? profileInitial
                  : "👤"}
              </span>

              <span className="profile-name">
                {currentUser?.name ||
                  "Profile"}
              </span>

              <span className="profile-arrow">
                ▾
              </span>

            </button>


            {profileOpen && (
              <div className="profile-dropdown">

                <div className="profile-header">

                  <div className="profile-large-avatar">
                    {currentUser
                      ? profileInitial
                      : "👤"}
                  </div>

                  <div className="profile-user-info">

                    <strong>
                      {currentUser?.name ||
                        "Guest User"}
                    </strong>

                    <span>
                      {currentUser?.email ||
                        "Not logged in"}
                    </span>

                  </div>

                </div>


                <div className="profile-divider"></div>


                {/* MY PROFILE */}

                <NavLink
                  to="/profile"
                  className="profile-menu-item"
                  onClick={
                    closeProfile
                  }
                >
                  <span>👤</span>
                  My Profile
                </NavLink>


                {/* MY ORDERS */}

                <NavLink
                  to="/orders"
                  className="profile-menu-item"
                  onClick={
                    closeProfile
                  }
                >
                  <span>📦</span>
                  My Orders
                </NavLink>


                {/* LOGOUT */}

                <button
                  type="button"
                  className="profile-menu-item logout-item"
                  onClick={
                    handleLogout
                  }
                >
                  <span>🚪</span>
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>


        {/* =====================================
            MOBILE ACTIONS
        ===================================== */}

        <div className="mobile-actions">

          {/* MOBILE CART */}

          <NavLink
            to="/cart"
            className="mobile-cart"
            onClick={closeMenu}
          >
            <span>🛒</span>

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </NavLink>


          {/* MOBILE PROFILE */}

          <button
            type="button"
            className={`mobile-profile-button ${
              profileOpen
                ? "open"
                : ""
            }`}
            onClick={() => {
              setProfileOpen(
                (previous) =>
                  !previous
              );

              setMenuOpen(false);
            }}
            aria-label="Open profile menu"
            aria-expanded={
              profileOpen
            }
          >

            <span className="profile-avatar">
              {currentUser
                ? profileInitial
                : "👤"}
            </span>

          </button>


          {/* HAMBURGER */}

          <button
            type="button"
            className={`menu-toggle ${
              menuOpen
                ? "open"
                : ""
            }`}
            onClick={() => {
              setMenuOpen(
                (previous) =>
                  !previous
              );

              setProfileOpen(false);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={
              menuOpen
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>


      {/* =====================================
          MOBILE PROFILE DROPDOWN
      ===================================== */}

      {profileOpen && (
        <div className="mobile-profile-dropdown">

          <div className="profile-header">

            <div className="profile-large-avatar">
              {currentUser
                ? profileInitial
                : "👤"}
            </div>

            <div className="profile-user-info">

              <strong>
                {currentUser?.name ||
                  "Guest User"}
              </strong>

              <span>
                {currentUser?.email ||
                  "Not logged in"}
              </span>

            </div>

          </div>


          <div className="profile-divider"></div>


          {/* MY PROFILE */}

          <NavLink
            to="/profile"
            className="profile-menu-item"
            onClick={() => {
              closeProfile();
              closeMenu();
            }}
          >
            <span>👤</span>
            My Profile
          </NavLink>


          {/* MY ORDERS */}

          <NavLink
            to="/orders"
            className="profile-menu-item"
            onClick={() => {
              closeProfile();
              closeMenu();
            }}
          >
            <span>📦</span>
            My Orders
          </NavLink>


          {/* LOGOUT */}

          <button
            type="button"
            className="profile-menu-item logout-item"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>

        </div>
      )}


      {/* =====================================
          MOBILE MENU
      ===================================== */}

      <div
        className={`mobile-menu ${
          menuOpen
            ? "show"
            : ""
        }`}
      >

        {/* HOME */}

        <a
          href="/"
          className={
            location.pathname === "/" &&
            activeSection === "home"
              ? "mobile-nav-link active"
              : "mobile-nav-link"
          }
          onClick={
            handleHomeNavigation
          }
        >
          Home
        </a>


        {/* CAKES */}

        <a
          href="/cakes"
          className={
            location.pathname ===
              "/cakes" ||
            (
              location.pathname === "/" &&
              activeSection === "cakes"
            )
              ? "mobile-nav-link active"
              : "mobile-nav-link"
          }
          onClick={(event) => {
            event.preventDefault();

            if (
              location.pathname === "/"
            ) {
              handleSectionNavigation(
                "our-menu"
              );
            } else {
              closeMenu();
              closeProfile();

              navigate("/cakes");
            }
          }}
        >
          Cakes
        </a>


        {/* HOW IT WORKS */}

        <a
          href="/#how-it-works"
          className={
            location.pathname === "/" &&
            activeSection ===
              "how-it-works"
              ? "mobile-nav-link active"
              : "mobile-nav-link"
          }
          onClick={(event) => {
            event.preventDefault();

            handleSectionNavigation(
              "how-it-works"
            );
          }}
        >
          How It Works
        </a>


        {/* ORDERS */}

        <NavLink
          to="/orders"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive
              ? "mobile-nav-link active"
              : "mobile-nav-link"
          }
        >
          Orders
        </NavLink>


        {/* LOGIN */}

        <NavLink
          to="/login"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive
              ? "mobile-nav-link active"
              : "mobile-nav-link"
          }
        >
          Login
        </NavLink>


        {/* REGISTER */}

        <NavLink
          to="/register"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive
              ? "mobile-nav-link active"
              : "mobile-nav-link"
          }
        >
          Register
        </NavLink>


        {/* CART */}

        <NavLink
          to="/cart"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive
              ? "mobile-nav-link active mobile-cart-menu-link"
              : "mobile-nav-link mobile-cart-menu-link"
          }
        >
          🛒 Cart

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;