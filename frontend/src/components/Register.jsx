import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            userId,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("✅ Account created successfully!");

      // Clear form
      setName("");
      setUserId("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error("Register error:", error);

      alert(
        "❌ Unable to connect to server."
      );
    }
  };

  return (
    <section className="register-section">

      <div className="register-card">

        <div className="register-icon">
          📝
        </div>

        <div className="register-heading">

          <span>
            ✦ CREATE YOUR ACCOUNT ✦
          </span>

          <h1>
            Join <em>MbeautyCakes</em>
          </h1>

          <p>
            Create your account and start
            ordering delicious cakes.
          </p>

        </div>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          {/* Full Name */}

          <div className="register-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>

          {/* User ID */}

          <div className="register-group">

            <label htmlFor="userId">
              User ID
            </label>

            <input
              id="userId"
              type="text"
              placeholder="Choose your User ID"
              value={userId}
              onChange={(e) =>
                setUserId(e.target.value)
              }
              required
            />

          </div>

          {/* Email */}

          <div className="register-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          {/* Password */}

          <div className="register-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="register-button"
          >
            Create Account
            <span>→</span>
          </button>

        </form>

      </div>

    </section>
  );
}

export default Register;