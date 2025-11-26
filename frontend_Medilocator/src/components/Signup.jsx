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
<<<<<<< HEAD
      await axios.post("api/v1/users/register", formData);
=======
      await axios.post("http://localhost:8000/api/v1/users/register", formData);
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
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

=======
    <div
      className="d-flex"
      style={{ background: "#f6fafc", minHeight: "100vh", paddingTop: "40px" }}
    >
      {/* LEFT BLUE PART */}
      <div
        className="d-none d-md-flex flex-column justify-content-start px-5"
        style={{
          flex: 1.2,
          background: "linear-gradient(135deg, #1FA2FF, #0073FF)",
          borderRadius: "0 40px 40px 0",
          color: "white",
          paddingLeft: "70px",
          paddingTop: "80px",
        }}
      >
        <h1 style={{ fontSize: "38px", fontWeight: "700" }}>
          Create Your Account
        </h1>

        <p
          style={{
            fontSize: "17px",
            maxWidth: "360px",
            marginTop: "15px",
            opacity: "0.95",
          }}
        >
          Join MediLocator to quickly find nearby stores and access medicines
          without hassle.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966489.png"
          alt="signup illustration"
          style={{ width: "200px", marginTop: "40px" }}
        />
      </div>

      {/* RIGHT SIGNUP CARD */}
      <div
        className="d-flex justify-content-center"
        style={{ flex: 1, marginTop: "60px", marginBottom: "40px" }}
      >
        <div
          className="card shadow-lg p-4"
          style={{ width: "360px", borderRadius: "18px", background: "#ffffff" }}
        >
          <h3 className="text-center mb-4" style={{ fontWeight: "600" }}>
            Signup
          </h3>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="form-control"
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* CONTACT NO */}
            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input
                type="number"
                name="contactNo"
                required
                value={formData.contactNo}
                onChange={handleChange}
                className="form-control"
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* GENDER */}
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
                style={{ borderRadius: "10px", height: "40px" }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100"
              style={{ height: "43px", fontWeight: "600", borderRadius: "10px" }}
            >
              {loading ? "Creating account…" : "Signup"}
            </button>

            {/* LINK */}
            <p className="text-center mt-3" style={{ fontSize: "14px" }}>
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                style={{
                  color: "#0073FF",
                  cursor: "pointer",
                  marginLeft: "4px",
                  textDecoration: "underline",
                }}
              >
                Login here
              </span>
            </p>
          </form>
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d
