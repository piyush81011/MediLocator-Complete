import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StoreSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    contactNo: "",
    licenseNumber: "",
    address: "",
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
      await api.post("/stores/register", formData);
      setSuccess("Store registered successfully! Redirecting...");
      setTimeout(() => navigate("/admin/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          
          {/* LEFT SIDE - Store Registration Info */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: "#ffffff" }}>
            <div style={{ maxWidth: "500px", padding: "40px" }}>
              <div className="mb-4" style={{ 
                width: "70px", 
                height: "70px", 
                backgroundColor: "#e3f2fd", 
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}>
                🏥
              </div>
              
              <h1 className="fw-bold mb-4" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
                Register Your Pharmacy
              </h1>
              <p className="text-muted mb-5" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                Join MediLocator's network of pharmacies and connect with customers looking for medicines in your area.
              </p>

              <div className="mb-4">
                <div className="d-flex align-items-start mb-4">
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
                    🎯
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Reach More Customers</h5>
                    <p className="text-muted mb-0">Make your pharmacy visible to nearby users</p>
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
                    📊
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Manage Inventory</h5>
                    <p className="text-muted mb-0">Easy tools to track and update your stock</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    backgroundColor: "#f3e8ff", 
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    fontSize: "1.5rem"
                  }}>
                    ⚡
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Quick Setup</h5>
                    <p className="text-muted mb-0">Get started in minutes with our simple process</p>
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
                    <h2 className="fw-bold mb-2">Create Store Account</h2>
                    <p className="text-muted mb-0">Register your pharmacy with us</p>
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
                      <label className="form-label">Store Name</label>
                      <input
                        type="text"
                        name="storeName"
                        required
                        value={formData.storeName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Your Pharmacy Name"
                      />
                    </div>

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

                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
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
                      <label className="form-label">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        required
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Your pharmacy license number"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Store Address</label>
                      <textarea
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="form-control"
                        rows="2"
                        placeholder="Full store address"
                      ></textarea>
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
                        placeholder="Create a strong password"
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
                        "Register Store"
                      )}
                    </button>

                    <p className="text-center mb-0">
                      Already registered?{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/admin/login");
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