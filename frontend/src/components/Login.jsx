import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem("token", data.token);

      console.log("LOGIN DATA:", data);
      console.log("LOGIN USER:", data.user);
      console.log("LOGIN ROLE:", data.user.role);

      alert(`✅ Welcome ${data.user.name}!`);

      if (data.user.role === "admin") {
        navigate("/admin/orders");
      } else {
        navigate("/");
      }

      setUserId("");
      setPassword("");

    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Unable to connect to server.");
    }
  };

  return (
    <section className="login-section">

      <div className="login-card">

        <div className="login-icon">
          🔐
        </div>

        <div className="login-heading">
          <span>✦ WELCOME BACK ✦</span>

          <h1>
            Login to <em>MbeautyCakes</em>
          </h1>

          <p>
            Access your account and manage your orders.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label htmlFor="userId">
              User ID
            </label>

            <input
              id="userId"
              type="text"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) =>
                setUserId(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
            <span>→</span>
          </button>

        </form>

        <div className="login-footer">
          <span>Fresh cakes.</span>
          <span>Happy celebrations.</span>
        </div>

      </div>

    </section>
  );
}

export default Login;