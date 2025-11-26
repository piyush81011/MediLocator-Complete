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
      // Works with Vite Proxy
      await axios.post("/api/v1/users/register", formData);

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex"
      style={{ background: "#f6fafc", minHeight: "100vh", paddingTop: "40px" }}
    >
      {/* LEFT PANEL */}
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

      {/* RIGHT FORM PANEL */}
      <div
        className="d-flex justify-content-center"
        style={{ flex: 1, marginTop: "60px", marginBottom: "40px" }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            width: "360px",
            borderRadius: "18px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
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

            {/* CONTACT */}
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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100"
              style={{
                height: "43px",
                fontWeight: "600",
                borderRadius: "10px",
              }}
            >
              {loading ? "Creating account…" : "Signup"}
            </button>

            {/* LOGIN LINK */}
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
        </div>
      </div>
    </div>
  );
}
