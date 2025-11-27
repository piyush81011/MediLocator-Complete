import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddStock() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const medicine = state?.medicine;

  const [formData, setFormData] = useState({
    price: "",
    stockQuantity: "",
    expiryDate: "",
    batchNumber: "",
    minStockAlert: "10",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if no medicine data
  if (!medicine) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          <h2 className="alert-heading">⚠️ No Medicine Selected</h2>
          <p>Please select a medicine from the catalog first.</p>
          <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
            Go to Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.price || formData.price <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    if (!formData.stockQuantity || formData.stockQuantity <= 0) {
      setError("Please enter a valid quantity");
      return false;
    }
    if (!formData.expiryDate) {
      setError("Please select an expiry date");
      return false;
    }

    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    if (expiry <= today) {
      setError("Expiry date must be in the future");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please login first");
        setTimeout(() => navigate('/store'), 2000);
        return;
      }

      const response = await api.post(
        "/inventory",
        {
          productId: medicine._id || medicine.id,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity),
          expiryDate: formData.expiryDate,
          batchNumber: formData.batchNumber.trim(),
          minStockAlert: parseInt(formData.minStockAlert),
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/store/inventory');
        }, 2000);
      }
    } catch (err) {
      console.error("Error adding to inventory:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate('/store/login'), 2000);
      } else if (err.response?.status === 409) {
        setError("This product already exists in your inventory. Please update it instead.");
      } else {
        setError(err.response?.data?.message || "Failed to add product to inventory. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered data will be lost.")) {
      navigate(-1);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-10 col-xl-8 mx-auto">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h2 className="mb-0">Add Stock to Inventory</h2>
          </div>

          {/* Medicine Info Card */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4 className="card-title mb-0">{medicine.name}</h4>
                {medicine.requiresPrescription && (
                  <span className="badge bg-warning text-dark">⚕️ Rx Required</span>
                )}
              </div>

              <hr />

              <div className="row g-3">
                <div className="col-md-6">
                  <small className="text-muted d-block mb-1">Brand</small>
                  <strong>{medicine.brand}</strong>
                </div>

                {medicine.genericName && (
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-1">Generic Name</small>
                    <strong>{medicine.genericName}</strong>
                  </div>
                )}

                {medicine.category && (
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-1">Category</small>
                    <span className="badge bg-info text-capitalize">{medicine.category}</span>
                  </div>
                )}

                {medicine.dosageForm && (
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-1">Dosage Form</small>
                    <strong>{medicine.dosageForm}</strong>
                  </div>
                )}

                {medicine.packSize && (
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-1">Pack Size</small>
                    <strong>{medicine.packSize}</strong>
                  </div>
                )}

                {medicine.manufacturer && (
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-1">Manufacturer</small>
                    <strong>{medicine.manufacturer}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>✓ Success!</strong> {medicine.name} has been added to your inventory. Redirecting...
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>⚠ Error!</strong> {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Form */}
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Price */}
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">
                      Price per Unit <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        disabled={loading}
                      />
                    </div>
                    <small className="form-text text-muted">Enter the selling price per unit</small>
                  </div>

                  {/* Stock Quantity */}
                  <div className="col-md-6">
                    <label htmlFor="stockQuantity" className="form-label">
                      Stock Quantity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="stockQuantity"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="0"
                      min="1"
                      required
                      disabled={loading}
                    />
                    <small className="form-text text-muted">Number of units in stock</small>
                  </div>

                  {/* Expiry Date */}
                  <div className="col-md-6">
                    <label htmlFor="expiryDate" className="form-label">
                      Expiry Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      disabled={loading}
                    />
                    <small className="form-text text-muted">Product expiration date</small>
                  </div>

                  {/* Batch Number */}
                  <div className="col-md-6">
                    <label htmlFor="batchNumber" className="form-label">
                      Batch Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      placeholder="e.g., BATCH001"
                      required
                      disabled={loading}
                    />
                    <small className="form-text text-muted">Manufacturing batch number</small>
                  </div>

                  {/* Min Stock Alert */}
                  <div className="col-12">
                    <label htmlFor="minStockAlert" className="form-label">
                      Minimum Stock Alert Level
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="minStockAlert"
                      name="minStockAlert"
                      value={formData.minStockAlert}
                      onChange={handleChange}
                      placeholder="10"
                      min="0"
                      disabled={loading}
                    />
                    <small className="form-text text-muted">
                      You'll be notified when stock falls below this level
                    </small>
                  </div>
                </div>

                {/* Form Actions */}
                <hr className="my-4" />
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding to Inventory...
                      </>
                    ) : (
                      <>✓ Add to Inventory</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Box */}
          <div className="alert alert-info mt-4" role="alert">
            <h5 className="alert-heading">📋 Important Information</h5>
            <ul className="mb-0">
              <li>Ensure all product details are accurate before submitting</li>
              <li>Double-check the expiry date to avoid expired stock</li>
              <li>Batch numbers help with tracking and recalls</li>
              <li>Set appropriate stock alerts to prevent shortages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}