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
        <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="container">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
              <div className="col-md-6">
                <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <div className="card-body text-center p-5">
                    <div className="mb-4" style={{ fontSize: '4rem' }}>🔍</div>
                    <h2 className="fw-bold mb-3">No Medicine Selected</h2>
                    <p className="text-muted mb-4">Please select a medicine from the catalog to add it to your inventory.</p>
                    <button 
                      className="btn btn-primary btn-lg px-5" 
                      onClick={() => navigate('/store/catalog-search')}
                      style={{ borderRadius: '50px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      Browse Catalog
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
      const response = await api.post(
        "/inventory/", 
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
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f5f7fa' }}>
        <div className="container-fluid" style={{ maxWidth: '1200px' }}>
          
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button 
                className="btn btn-link text-decoration-none p-0 mb-2" 
                onClick={() => navigate(-1)}
                style={{ color: '#667eea', fontSize: '0.95rem' }}
              >
                ← Back to Catalog
              </button>
              <h1 className="display-6 fw-bold mb-1">Add to Inventory</h1>
              <p className="text-muted mb-0">Configure pricing and stock details</p>
            </div>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success border-0 shadow-sm mb-4" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
              <div className="d-flex align-items-center">
                <div className="me-3" style={{ fontSize: '2rem' }}>✓</div>
                <div>
                  <h5 className="mb-1 fw-bold">Product Added Successfully!</h5>
                  <p className="mb-0">Redirecting to inventory...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center">
                <div className="me-3" style={{ fontSize: '1.5rem' }}>⚠️</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Medicine Info Card */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="me-4" style={{ fontSize: '3rem', opacity: 0.9 }}>💊</div>
                <div>
                  <h3 className="mb-1 fw-bold">{medicine.name}</h3>
                  <div className="d-flex gap-3 flex-wrap">
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '20px' }}>
                      {medicine.brand}
                    </span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '20px' }}>
                      {medicine.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Stock Details</h5>
                
                <div className="row g-4">
                  {/* Price */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-2">
                      <span className="me-2">💰</span>Price (₹)
                    </label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      className="form-control form-control-lg" 
                      required
                      style={{ borderRadius: '12px', border: '2px solid #e0e7ff', padding: '12px 20px' }}
                      placeholder="Enter selling price"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-2">
                      <span className="me-2">📦</span>Stock Quantity
                    </label>
                    <input 
                      type="number" 
                      name="stockQuantity" 
                      value={formData.stockQuantity} 
                      onChange={handleChange} 
                      className="form-control form-control-lg" 
                      required
                      style={{ borderRadius: '12px', border: '2px solid #e0e7ff', padding: '12px 20px' }}
                      placeholder="Available units"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-2">
                      <span className="me-2">📅</span>Expiry Date
                    </label>
                    <input 
                      type="date" 
                      name="expiryDate" 
                      value={formData.expiryDate} 
                      onChange={handleChange} 
                      className="form-control form-control-lg" 
                      required
                      style={{ borderRadius: '12px', border: '2px solid #e0e7ff', padding: '12px 20px' }}
                    />
                  </div>

                  {/* Batch Number */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-2">
                      <span className="me-2">🏷️</span>Batch Number
                    </label>
                    <input 
                      type="text" 
                      name="batchNumber" 
                      value={formData.batchNumber} 
                      onChange={handleChange} 
                      className="form-control form-control-lg"
                      style={{ borderRadius: '12px', border: '2px solid #e0e7ff', padding: '12px 20px' }}
                      placeholder="Optional"
                    />
                  </div>

                  {/* Min Stock Alert */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-2">
                      <span className="me-2">⚠️</span>Minimum Stock Alert
                    </label>
                    <input 
                      type="number" 
                      name="minStockAlert" 
                      value={formData.minStockAlert} 
                      onChange={handleChange} 
                      className="form-control form-control-lg"
                      style={{ borderRadius: '12px', border: '2px solid #e0e7ff', padding: '12px 20px' }}
                    />
                    <small className="text-muted">You'll be notified when stock falls below this number</small>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <div className="d-flex gap-3 justify-content-end">
                  <button 
                    type="button"
                    className="btn btn-lg px-4" 
                    onClick={() => navigate(-1)}
                    style={{ borderRadius: '12px', border: '2px solid #e0e7ff', color: '#667eea' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-lg px-5" 
                    disabled={loading}
                    style={{ 
                      borderRadius: '12px', 
                      background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      border: 'none',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <span className="me-2">✓</span>
                        Add to Inventory
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}