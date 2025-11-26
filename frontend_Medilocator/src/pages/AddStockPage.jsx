import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "../components/AdminSidebar";

export default function AddStockPage() {
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

  if (!medicine) {
    return (
      <div className="d-flex vh-100">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
          <div className="alert alert-warning text-center" role="alert">
            <h2 className="alert-heading">No Medicine Selected</h2>
            <p>Please select a medicine from the catalog first.</p>
            <button className="btn btn-primary" onClick={() => navigate('/store/catalog-search')}>
              Go to Catalog Search
            </button>
          </div>
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
      setError("Please enter a valid price"); return false;
    }
    if (!formData.stockQuantity || formData.stockQuantity <= 0) {
      setError("Please enter a valid quantity"); return false;
    }
    if (!formData.expiryDate) {
      setError("Please select an expiry date"); return false;
    }
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    if (expiry <= today) {
      setError("Expiry date must be in the future"); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://medilocator-complete.onrender.com/api/v1/inventory/", 
        {
          productId: medicine._id,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity),
          expiryDate: formData.expiryDate,
          batchNumber: formData.batchNumber.trim(),
          minStockAlert: parseInt(formData.minStockAlert),
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/store/inventory');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This product already exists in your inventory. Please go to 'My Inventory' to update it.");
      } else {
        setError(err.response?.data?.message || "Failed to add product.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back to Catalog
        </button>
        <h1 className="display-5">Add to My Inventory</h1>
        
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-0">{medicine.name}</h4>
              <p><strong>Brand:</strong> {medicine.brand}</p>
            </div>
        </div>

        {success && <div className="alert alert-success">Product added successfully! Redirecting...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card p-4">
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Price (₹)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control form-control-lg" required /></div>
              <div className="col-md-6"><label className="form-label">Stock Quantity</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="form-control form-control-lg" required /></div>
              <div className="col-md-6"><label className="form-label">Expiry Date</label><input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="form-control form-control-lg" required /></div>
              <div className="col-md-6"><label className="form-label">Batch Number</label><input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} className="form-control form-control-lg" /></div>
              <div className="col-md-6"><label className="form-label">Min Stock Alert</label><input type="number" name="minStockAlert" value={formData.minStockAlert} onChange={handleChange} className="form-control form-control-lg" /></div>
            </div>
            <hr className="my-4" />
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-lg btn-success" disabled={loading}>
                  {loading ? "Adding..." : "Add to Inventory"}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}