import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2">
      <div className="container">

        {/* Brand Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src={logo}
            alt="MediLocator"
            style={{ height: "45px", width: "50px", objectFit: "contain" }}
          />
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">

          {/* Left Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="/">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="/">Support 24/7</a>
            </li>
          </ul>

          {/* Right Side: Search + Buttons */}
          <div className="d-flex align-items-center gap-2">

            {/* Search Box */}
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search..."
              style={{ maxWidth: "220px" }}
            />

            {/* Login */}
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            {/* Signup */}
            <button
              className="btn btn-success btn-sm text-white"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>

            {/* Admin */}
            <button
              className="btn btn-dark btn-sm"
              onClick={() => navigate("/admin/login")}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
