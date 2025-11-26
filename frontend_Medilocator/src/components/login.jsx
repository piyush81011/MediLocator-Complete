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
<<<<<<< HEAD
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          
          {/* LEFT SIDE - Info Section */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: "#ffffff" }}>
            <div style={{ maxWidth: "500px", padding: "40px" }}>
              <img
                src={logo}
                alt="MediLocator Logo"
                style={{ width: "80px", marginBottom: "30px" }}
              />
              
              <h1 className="fw-bold mb-4" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
                Welcome Back to MediLocator
              </h1>
              <p className="text-muted mb-5" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                Sign in to access your account and continue finding medicines and pharmacies near you.
              </p>

              <div className="mb-4">
                <div className="d-flex align-items-start mb-4">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    fontSize: "1.5rem"
                  }}>
                    🔍
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Quick Medicine Search</h5>
                    <p className="text-muted mb-0">Find any medicine at nearby pharmacies instantly</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#fff3e0", 
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    fontSize: "1.5rem"
                  }}>
                    📍
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Find Nearby Stores</h5>
                    <p className="text-muted mb-0">Get directions to the closest pharmacies</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#e8f5e9", 
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    fontSize: "1.5rem"
                  }}>
                    💰
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Compare Prices</h5>
                    <p className="text-muted mb-0">Save money by comparing prices across stores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Login Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  
                  {/* Logo */}
                  <div className="text-center mb-4">
                    <img src={logo} alt="logo" style={{ width: "70px" }} />
                  </div>

                  {/* Header */}
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Welcome Back</h2>
                    <p className="text-muted mb-0">Sign in to your account</p>
                  </div>

                  {/* Alerts */}
                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success">{success}</div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-100 mb-3"
                      style={{ height: "45px" }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>

                    <p className="text-center mb-0">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/signup");
                        }}
                        className="text-decoration-none fw-semibold"
                      >
                        Sign up
                      </a>
                    </p>
                  </form>

                </div>
              </div>
            </div>
          </div>

=======
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
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d
        </div>
      </div>
    </div>
  );
}