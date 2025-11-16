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
      const res = await axios.post("/api/v1/stores/login", formData);

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
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  // layout styles
  const leftStyle = {
    background: "linear-gradient(135deg,#1FA2FF,#0073FF)",
    color: "#fff",
    borderRadius: "0 40px 40px 0",
    paddingLeft: 70,
    paddingTop: 100,
    paddingBottom: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  const rightWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: 70,
    marginBottom: 40,
  };

  const cardStyle = {
    width: 360,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
  };

  // Ensure page content sits below any navbar (adjust if your navbar height differs)
  const pageStyle = { background: "#f6fafc", minHeight: "100vh", paddingTop: 80 };

  return (
    <main style={pageStyle}>
      <div className="container-fluid">
        <div className="row g-0">
          {/* LEFT (hero) */}
          <div className="d-none d-md-block col-md-7">
            <div style={leftStyle}>
              <h1
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: 15,
                }}
              >
                Welcome Back,
                <br />
                Store Owner
              </h1>

              <p
                style={{
                  fontSize: 17,
                  maxWidth: 360,
                  opacity: 0.92,
                  marginBottom: 20,
                }}
              >
                Login to manage your medicine listings, check availability, and
                help users find urgent medical supplies instantly.
              </p>

              <img
                src="https://cdn-icons-png.flaticon.com/512/1048/1048930.png"
                alt="pharmacy"
                style={{ width: 230, marginTop: 25, opacity: 0.95 }}
              />
            </div>
          </div>

          {/* RIGHT (form) */}
          <div className="col-12 col-md-5">
            <div style={rightWrapperStyle}>
              <div className="card shadow-lg p-4" style={cardStyle}>
                <h3
                  className="text-center mb-4"
                  style={{ fontWeight: 600, color: "#333" }}
                >
                  Store Login
                </h3>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2" role="status">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Store Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                      style={{ borderRadius: 10, height: 40 }}
                      aria-label="store email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      required
                      style={{ borderRadius: 10, height: 40 }}
                      aria-label="password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                    style={{
                      height: 43,
                      fontSize: 15,
                      fontWeight: 600,
                      borderRadius: 10,
                    }}
                  >
                    {loading ? "Logging in…" : "Login"}
                  </button>

                  <p className="text-center mt-3" style={{ fontSize: 14 }}>
                    Not registered yet?
                    <span
                      onClick={() => navigate("/admin/register")}
                      style={{
                        color: "#0073FF",
                        cursor: "pointer",
                        marginLeft: 6,
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
        </div>
      </div>
    </main>
  );
}
