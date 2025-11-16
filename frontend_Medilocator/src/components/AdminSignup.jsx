import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StoreSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    phone: "",
    license: "",
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
      await axios.post("/api/v1/stores/register", formData);
      setSuccess("Store registered successfully! Redirecting...");
      setTimeout(() => navigate("/admin/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex"
      style={{ background: "#f6fafc", minHeight: "100vh" }}
    >
      
      {/* LEFT BLUE GRADIENT PANEL (STORE VERSION) */}
      <div
        className="d-none d-md-flex flex-column justify-content-start px-5"
        style={{
          flex: 1.2,
          background: "linear-gradient(135deg, #1FA2FF, #0073FF)",
          borderRadius: "0 40px 40px 0",
          color: "white",
          paddingLeft: "70px",
          paddingTop: "80px",
          paddingBottom: "60px",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "700",
            lineHeight: "1.2",
            marginBottom: "15px",
          }}
        >
          Register Your <br /> Medical Store
        </h1>

        <p
          style={{
            fontSize: "17px",
            maxWidth: "360px",
            opacity: 0.92,
            marginBottom: "20px",
          }}
        >
          Connect with nearby users, manage medicine availability, and help 
          people access medical support easily and quickly.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048930.png"
          alt="pharmacy illustration"
          style={{
            width: "220px",
            marginTop: "25px",
            opacity: 0.95,
          }}
        />
      </div>

      {/* RIGHT SIGNUP FORM */}
      <div
        className="d-flex justify-content-center"
        style={{ flex: 1, marginTop: "60px", marginBottom: "40px" }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            width: "380px",
            borderRadius: "18px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            className="text-center mb-4"
            style={{ fontWeight: "600", color: "#333" }}
          >
            Store Signup
          </h3>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* Store Name */}
            <div className="mb-3">
              <label className="form-label">Store Name</label>
              <input
                type="text"
                name="storeName"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* Owner Name */}
            <div className="mb-3">
              <label className="form-label">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Store Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="number"
                name="phone"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* License */}
            <div className="mb-3">
              <label className="form-label">Store License Number</label>
              <input
                type="text"
                name="license"
                className="form-control"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "40px" }}
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Store Address</label>
              <textarea
                name="address"
                className="form-control"
                rows="2"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px" }}
              ></textarea>
            </div>

            {/* Password */}
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

            {/* Signup Button */}
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
              {loading ? "Creating account…" : "Signup"}
            </button>

            {/* Login Link */}
            <p className="text-center mt-3" style={{ fontSize: "14px" }}>
              Already registered?
              <span
                onClick={() => navigate("/admin/login")}
                style={{
                  color: "#0073FF",
                  cursor: "pointer",
                  marginLeft: "3px",
                  textDecoration: "underline",
                }}
              >
                Login here
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
