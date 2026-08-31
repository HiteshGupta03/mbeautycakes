import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Profile.css";

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Failed to load user:",
      error
    );

    return null;
  }
}

function Profile() {
  const [user] = useState(getStoredUser);

  /* =========================================
     NOT LOGGED IN
  ========================================= */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /* =========================================
     PROFILE INITIAL
  ========================================= */

  const initial =
    user.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";


  /* =========================================
     PROFILE PAGE
  ========================================= */

  return (
    <section className="profile-page">

      <div className="profile-container">

        {/* =====================================
            HEADING
        ===================================== */}

        <div className="profile-heading">

          <div className="profile-label">
            <span>✦</span>
            MY PROFILE
            <span>✦</span>
          </div>

          <h1>
            Welcome,
            <span> {user.name}</span>
          </h1>

          <p>
            Manage your account information
            and view your MbeautyCakes profile.
          </p>

        </div>


        {/* =====================================
            PROFILE CARD
        ===================================== */}

        <div className="profile-card">

          <div className="profile-card-top">

            <div className="profile-main-avatar">
              {initial}
            </div>

            <div className="profile-main-info">

              <h2>
                {user.name}
              </h2>

              <p>
                {user.email}
              </p>

              {user.role && (
                <span className="profile-role">
                  {user.role}
                </span>
              )}

            </div>

          </div>


          {/* =====================================
              DIVIDER
          ===================================== */}

          <div className="profile-divider"></div>


          {/* =====================================
              ACCOUNT INFORMATION
          ===================================== */}

          <div className="profile-info-grid">

            <div className="profile-info-box">

              <span className="profile-info-icon">
                👤
              </span>

              <div>

                <small>
                  Full Name
                </small>

                <strong>
                  {user.name}
                </strong>

              </div>

            </div>


            <div className="profile-info-box">

              <span className="profile-info-icon">
                ✉️
              </span>

              <div>

                <small>
                  Email Address
                </small>

                <strong>
                  {user.email}
                </strong>

              </div>

            </div>


            <div className="profile-info-box">

              <span className="profile-info-icon">
                🔐
              </span>

              <div>

                <small>
                  Account Type
                </small>

                <strong>
                  {user.role || "Customer"}
                </strong>

              </div>

            </div>

          </div>


          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="profile-actions">

            <Link
              to="/orders"
              className="profile-action primary"
            >
              📦 My Orders
              <span>→</span>
            </Link>

            <Link
              to="/cakes"
              className="profile-action secondary"
            >
              🍰 Explore Cakes
              <span>→</span>
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Profile;