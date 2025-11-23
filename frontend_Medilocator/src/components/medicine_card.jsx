import React from "react";
import { useNavigate } from "react-router-dom";

export default function MedicineCard({ medicine }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const user = localStorage.getItem("user");

    // If not logged in → go to login
    if (!user) {
      navigate("/login");
      return;
    }

    alert("Added to cart!");
  };

  return (
    <div className="card shadow-sm p-3 h-100 border-0" style={{ cursor: "pointer" }}>

      <div className="card-body">

        {/* Brand */}
        <p className="text-muted mb-1">
          {medicine.brand || "Unknown Brand"}
        </p>

        {/* Name */}
        <h5 className="fw-bold mb-2">
          {medicine.name || "Medicine Name"}
        </h5>

        {/* Pack Size */}
        <p className="small text-secondary mb-3">
          {medicine.pack || medicine.packSize || "10 tablets"}
        </p>

        {/* Price Section */}
        <div className="d-flex align-items-center gap-2 mb-3">

          {/* Price */}
          <span className="fw-bold text-success fs-5">
            ₹{medicine.price || 50}
          </span>

          {/* MRP (Cut Price) */}
          {medicine.mrp && (
            <span className="text-decoration-line-through text-muted">
              ₹{medicine.mrp}
            </span>
          )}

          {/* Discount Badge */}
          {medicine.discount && (
            <span className="badge bg-danger">
              {medicine.discount}% OFF
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className="btn btn-success w-100"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}
