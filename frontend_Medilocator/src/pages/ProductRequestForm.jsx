import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "../components/AdminSidebar";

const ProductRequestForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    category: "medicine",
    genericName: "",
    manufacturer: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post("/requests", formData);
      setSuccess("Product request submitted successfully!");
      setTimeout(() => navigate("/store/my-requests"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-5">Request New Product</h1>
        <p className="lead">Fill this form if a product is not in the master catalog.</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="card p-4 mt-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input type="text" name="productName" onChange={handleChange} required className="form-control form-control-lg" />
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
              <label className="form-label">Generic Name (if known)</label>
              <input type="text" name="genericName" onChange={handleChange} className="form-control form-control-lg" />
            </div>
            <div className="col-12">
              <label className="form-label">Manufacturer (if known)</label>
              <input type="text" name="manufacturer" onChange={handleChange} className="form-control form-control-lg" />
            </div>
            <div className="col-12">
              <label className="form-label">Reason for Request</label>
              <textarea name="reason" onChange={handleChange} required className="form-control form-control-lg"></textarea>
            </div>
          </div>
          <hr className="my-4" />
          <button type="submit" className="btn btn-lg btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductRequestForm;