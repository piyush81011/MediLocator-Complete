import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../utils/api";
import "../styles/formStyles.css";

const AddProductCatalog = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "medicine",
    dosageForm: "",
    packSize: "",
    description: "",
    genericName: "",
    manufacturer: "",
    requiresPrescription: false,
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  
  const isRequestForm = window.location.pathname.includes('/store/request-product');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const url = isRequestForm ? "/requests" : "/catalog";
    const data = isRequestForm ? { ...formData, productName: formData.name } : formData;

    try {
      if (isRequestForm) {
        await api.post(url, data);
        setSuccess("Product request submitted successfully!");
        setTimeout(() => navigate("/store/my-requests"), 2000);
      } else {
        await api.post(url, data); 
        setSuccess("Product added to master catalog successfully!");
        setTimeout(() => navigate("/admin/master-catalog"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        
        {isRequestForm ? (
          <>
            <h1 className="display-5">Request New Product</h1>
            <p className="lead">Product not in catalog? Fill out this form to request it.</p>
          </>
        ) : (
          <>
            <h1 className="display-5">Add New Product to Master Catalog</h1>
            <p className="lead">This product will be available for all stores to add.</p>
          </>
        )}
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="card p-4 mt-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input type="text" name="name" onChange={handleChange} required className="form-control form-control-lg" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Brand</label>
              <input type="text" name="brand" onChange={handleChange} required className="form-control form-control-lg" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select form-select-lg">
                <option value="medicine">Medicine</option>
                <option value="equipment">Equipment</option>
                <option value="supplement">Supplement</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Generic Name</label>
              <input type="text" name="genericName" onChange={handleChange} className="form-control form-control-lg" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Dosage Form (e.g., Tablet, Syrup)</label>
              <input type="text" name="dosageForm" onChange={handleChange} className="form-control form-control-lg" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Pack Size (e.g., 15 Tablets)</label>
              <input type="text" name="packSize" onChange={handleChange} className="form-control form-control-lg" />
            </div>

            <div className="col-12">
              <label className="form-label">Manufacturer</label>
              <input 
                type="text" 
                name="manufacturer" 
                onChange={handleChange} 
                className="form-control form-control-lg"
              />
            </div>
            
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                onChange={handleChange} 
                className="form-control form-control-lg"
                rows="3"
              ></textarea>
            </div>

            <div className="col-12">
              <div className="form-check form-switch fs-5">
                <input 
                  type="checkbox" 
                  name="requiresPrescription" 
                  checked={formData.requiresPrescription} 
                  onChange={handleChange} 
                  className="form-check-input"
                  id="reqPrescription"
                />
                <label className="form-check-label" htmlFor="reqPrescription">Requires Prescription</label>
              </div>
            </div>
            
            {isRequestForm && (
              <div className="col-12">
                <label className="form-label">Reason for Request</label>
                <textarea 
                  name="reason" 
                  value={formData.reason} 
                  onChange={handleChange} 
                  required 
                  className="form-control form-control-lg"
                  rows="3"
                ></textarea>
              </div>
            )}
          </div>
          <hr className="my-4" />
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-lg btn-secondary" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-lg btn-primary" disabled={loading}>
              {loading ? "Submitting..." : (isRequestForm ? "Submit Request" : "Add Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductCatalog;