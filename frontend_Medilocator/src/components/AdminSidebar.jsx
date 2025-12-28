import React, { useState, useEffect } from "react";
import { 
  FaTachometerAlt, 
  FaStore, 
  FaListAlt, 
  FaSignOutAlt, 
  FaBox,
  FaCashRegister,
  FaHistory,
  FaUser
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../utils/api";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const store = localStorage.getItem("store");
    if (store) {
      try {
        const storeData = JSON.parse(store);
        setStoreName(storeData.storeName || storeData.name || "My Store");
      } catch {
        setStoreName("My Store");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/stores/logout");
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("store");
      navigate("/admin/login");
    }
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100" style={{ width: "240px", minWidth: "240px" }}>
      
      <a 
        href="#"
        onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }} 
        className="d-flex align-items-center mb-2 text-white text-decoration-none"
      >
        <img src={logo} alt="medilocator" style={{width: "35px", height: "35px"}} className="me-2" />
        <span className="fs-5">MediLocator</span>
      </a>

      {/* Store Name Badge */}
      <div className="bg-secondary rounded p-2 mb-2 d-flex align-items-center">
        <FaUser className="me-2" />
        <small className="text-truncate" style={{ maxWidth: "170px" }}>{storeName}</small>
      </div>
      
      <hr className="my-2" />

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
        
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/billing/new"); }} 
            className="nav-link text-white d-flex align-items-center"
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
            onClick={(e) => { e.preventDefault(); navigate("/store/my-requests"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            <FaListAlt className="me-2" />
            My Requests
          </a>
        </li>
        
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
        <li className="nav-item-header text-muted small ps-2">ADMIN</li>
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