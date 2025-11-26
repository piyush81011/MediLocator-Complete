import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    gender: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("https://medilocator-complete.onrender.com/api/v1/users/register", formData);

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          
          {/* LEFT SIDE - Info Section */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: "#ffffff" }}>
            <div style={{ maxWidth: "500px", padding: "40px" }}>
              <h1 className="fw-bold mb-4" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
                Welcome to MediLocator
              </h1>
              <p className="text-muted mb-5" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                Join thousands of users who trust MediLocator to find medicines and pharmacies quickly and easily.
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

          {/* RIGHT SIDE - Signup Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: "450px" }}>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  
                  {/* Header */}
                  <div className="mb-4">
                    <h2 className="fw-bold mb-2">Create Account</h2>
                    <p className="text-muted mb-0">Sign up to get started</p>
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
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your full name"
                      />
                    </div>

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

                    <div className="mb-3">
                      <label className="form-label">Contact Number</label>
                      <input
                        type="tel"
                        name="contactNo"
                        required
                        value={formData.contactNo}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="1234567890"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
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
                        placeholder="Create a password"
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
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    <p className="text-center mb-0">
                      Already have an account?{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/login");
                        }}
                        className="text-decoration-none fw-semibold"
                      >
                        Sign in
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