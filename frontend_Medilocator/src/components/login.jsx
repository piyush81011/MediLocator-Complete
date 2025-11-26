import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("https://medilocator-complete.onrender.com/api/v1/users/login", formData);

      login(res.data.data.user);

      setSuccess("Login successful!");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid">
        <div className="row min-vh-100">

          {/* LEFT PANEL – same design as Signup */}
          <div
            className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div style={{ maxWidth: "500px", padding: "40px" }}>
              <img src={logo} alt="logo" style={{ width: "80px" }} />

              <h1
                className="fw-bold mb-4 mt-4"
                style={{ fontSize: "2.5rem", color: "#1a1a1a" }}
              >
                Welcome Back to MediLocator
              </h1>

              <p
                className="text-muted mb-5"
                style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
              >
                Log in to access nearby pharmacies, track medicine availability, and compare prices easily.
              </p>

              <div className="mb-4">
                <div className="d-flex align-items-start mb-4">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "20px",
                      fontSize: "1.5rem",
                    }}
                  >
                    🔐
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Secure Login</h5>
                    <p className="text-muted mb-0">
                      Your account and data are safely protected.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#fce4ec",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "20px",
                      fontSize: "1.5rem",
                    }}
                  >
                    📱
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Smart Dashboard</h5>
                    <p className="text-muted mb-0">
                      Access all features in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL – Login form */}
          <div
            className="col-lg-6 d-flex align-items-center justify-content-center"
            style={{ padding: "40px 20px" }}
          >
            <div style={{ width: "100%", maxWidth: "450px" }}>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">

                  <div className="text-center mb-3">
                    <img src={logo} alt="logo" style={{ width: "65px" }} />
                  </div>

                  <div className="mb-4 text-center">
                    <h2 className="fw-bold mb-2">Login</h2>
                    <p className="text-muted mb-0">Access your MediLocator account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                  )}
                  {success && (
                    <div className="alert alert-success py-2">{success}</div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        required
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-100 mb-3"
                      style={{ height: "45px" }}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center mb-0">
                      Don’t have an account?{" "}
                      <span
                        onClick={() => navigate("/signup")}
                        style={{
                          cursor: "pointer",
                          color: "#0073FF",
                          fontWeight: "600",
                        }}
                      >
                        Sign up now
                      </span>
                    </p>
                  </form>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
