import React from "react";
// react-icons are components, not CSS, so they are fine to use
import { 
  FaBox, 
  FaStore, 
  FaPlusCircle, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaListAlt,
  FaCashRegister,
  FaHistory
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Imports the logo from your assets folder
import api from "../utils/api"; // Imports the API helper

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Step 1: Tell the backend to log out
      await api.post("/stores/logout");
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      // Step 2: Clear local storage (this is what logs you out)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("store");
      
      // Step 3: Redirect to login
      navigate("/admin/login");
    }
  };

  return (
    // Main sidebar container styled with Bootstrap classes
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100" style={{ width: "280px" }}>
      
      {/* Logo and App Title */}
      <a 
        href="#"
        onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }} 
        className="d-flex align-items-center mb-3 text-white text-decoration-none"
      >
        <img src={logo} alt="medilocator" style={{width: "40px", height: "40px"}} className="me-2" />
        <span className="fs-4">MediLocator Store</span>
      </a>
      
      <hr />

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaTachometerAlt className="me-2" />
            Dashboard
          </a>
        </li>
        
        {/* Billing (POS) Link */}
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/billing/new"); }} 
            className="nav-link text-white d-flex align-items-center fs-5"
          >
            <FaCashRegister className="me-2" />
            Billing (POS)
          </a>
        </li>

        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaStore className="me-2" />
            My Inventory
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/catalog-search"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaPlusCircle className="me-2" />
            Add from Catalog
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/my-requests"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaListAlt className="me-2" />
            My Product Requests
          </a>
        </li>
        
        {/* Sales History Link */}
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/billing/history"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaHistory className="me-2" />
            Sales History
          </a>
        </li>

        <hr className="text-secondary" />
        <li className="nav-item-header text-muted small ps-2">ADMIN TOOLS</li>
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/admin/master-catalog"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaBox className="me-2" />
            Master Catalog
          </a>
        </li>
      </ul>

      <hr />
      
      {/* Logout Button */}
      <div className="pb-2">
        <button 
          onClick={handleLogout} 
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;