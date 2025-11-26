import React from "react";
// We import react-icons, which are SVG icons and not a CSS file
// import { FaTachometerAlt, FaStore, FaPlusCircle, FaListAlt, FaSignOutAlt, FaBox } from "react-icons/fa"; // Removed to fix build error
import { useNavigate } from "react-router-dom";
// We have removed the import for "./AdminSidebar.css"

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("store");
    navigate("/admin/login");
  };

  return (
    // This is the main sidebar container, styled entirely with Bootstrap classes
    // d-flex: enables flexbox
    // flex-column: stacks children vertically
    // flex-shrink-0: prevents the sidebar from shrinking
    // p-3: adds padding
    // text-white bg-dark: sets text and background colors
    // vh-100: makes it full viewport height
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100" style={{ width: "280px" }}>
      
      {/* Sidebar Header/Logo */}
      <a 
        href="#"
        onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }} 
        className="d-flex align-items-center mb-3 text-white text-decoration-none"
      >
        {/* <FaBox className="me-2" size={30} /> */}
        <span className="fs-4">MediLocator Store</span>
      </a>
      
      <hr />

      {/* Navigation Links */}
      {/* nav-pills: styles the links as "pills"
          flex-column: stacks the links vertically
          mb-auto: this is key! It pushes everything below it to the bottom */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            {/* <FaTachometerAlt className="me-2" /> */}
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/inventory"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            {/* <FaStore className="me-2" /> */}
            My Inventory
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/catalog-search"); }} 
            className="nav-link text-white d-flex align-items-center"
          >
            {/* <FaPlusCircle className="me-2" /> */}
            Add from Catalog
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate("/store/my-requests"); }} 
            className="nav-link text-white d-flex align-items-center fw-bold display-5"
          >
            {/* <FaListAlt className="me-2" /> */}
            My Product Requests
          </a>
        </li>
      </ul>

      {/* Logout Button (pushed to the bottom by mb-auto on the ul) */}
      <hr />
      <div className="pb-2">
        <button 
          onClick={handleLogout} 
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
        >
          {/* <FaSignOutAlt className="me-2" /> */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
