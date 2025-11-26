import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StoreLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("https://medilocator-complete.onrender.com/api/v1/stores/login", formData);

      const { accessToken, refreshToken, store } = res.data.data || {};

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (store) {
        localStorage.setItem("store", JSON.stringify(store));
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 900);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          
          {/* LEFT SIDE - Store Owner Welcome */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: "#ffffff" }}>
            <div style={{ maxWidth: "500px", padding: "40px" }}>
              <div className="mb-4" style={{ 
                width: "70px", 
                height: "70px", 
                backgroundColor: "#e8f5e9", 
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}>
                🏪
              </div>
              
              <h1 className="fw-bold mb-4" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
                Welcome Back, Store Owner
              </h1>
              <p className="text-muted mb-5" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                Manage your pharmacy inventory, update stock levels, and help customers find the medicines they need.
              </p>

              <div className="mb-4">
                <div className="d-flex align-items-start mb-4">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#f0f9ff", 
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    fontSize: "1.5rem"
                  }}>
                    📦
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Manage Inventory</h5>
                    <p className="text-muted mb-0">Keep your medicine stock up to date</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#fef3c7", 
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
                    <h5 className="fw-semibold mb-2">Track Sales</h5>
                    <p className="text-muted mb-0">Monitor your pharmacy's performance</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#fce7f3", 
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    fontSize: "1.5rem"
                  }}>
                    👥
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Serve Customers</h5>
                    <p className="text-muted mb-0">Help people find medicines quickly</p>
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
                  
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="mb-3" style={{ fontSize: "3rem" }}>🏥</div>
                    <h2 className="fw-bold mb-2">Store Login</h2>
                    <p className="text-muted mb-0">Access your store dashboard</p>
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
                      <label className="form-label">Store Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="store@example.com"
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
                        "Login to Dashboard"
                      )}
                    </button>

                    <p className="text-center mb-0">
                      Don't have a store account?{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/admin/register");
                        }}
                        className="text-decoration-none fw-semibold"
                      >
                        Register now
                      </a>
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