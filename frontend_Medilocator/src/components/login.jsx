import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/v1/users/login", formData);
      
      // Use AuthContext login
      login(res.data.data.user);

      setSuccess("Login successful!");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex vh-100" style={{ background: "#f6fafc" }}>
      
      {/* LEFT MODERN BLUE GRADIENT PANEL */}
      <div
        className="d-none d-md-flex flex-column justify-content-center px-5"
        style={{
          flex: 1.2,
          background: "linear-gradient(135deg, #1FA2FF, #0073FF)",
          borderRadius: "0 40px 40px 0",
          color: "white",
          paddingLeft: "70px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "85px", marginBottom: "25px", filter: "invert(1)" }}
        />

        <h1 style={{ fontSize: "42px", fontWeight: "700", lineHeight: "1.2" }}>
          Welcome to <br /> MediLocator
        </h1>

        <p
          style={{
            fontSize: "17px",
            maxWidth: "350px",
            opacity: 0.9,
            marginTop: "10px",
          }}
        >
          Find nearby medical stores, compare availability, and order medicines easily.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966489.png"
          alt="illustration"
          style={{
            width: "260px",
            marginTop: "40px",
            opacity: 0.95,
          }}
        />
      </div>

      {/* RIGHT LOGIN CARD */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ flex: 1 }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            width: "350px",
            borderRadius: "18px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div className="text-center mb-3">
            <img src={logo} alt="logo" style={{ width: "60px" }} />
          </div>

          <h3
            className="text-center mb-3"
            style={{ fontWeight: "600", color: "#333" }}
          >
            Login
          </h3>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
              style={{
                height: "43px",
                fontSize: "15px",
                fontWeight: "600",
                borderRadius: "10px",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center mt-3" style={{ fontSize: "14px" }}>
              Not registered?
              <span
                onClick={() => navigate("/signup")}
                style={{
                  color: "#0073FF",
                  cursor: "pointer",
                  marginLeft: "3px",
                  textDecoration: "underline",
                }}
              >
                Signup now
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}