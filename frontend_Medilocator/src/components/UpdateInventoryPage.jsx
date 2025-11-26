import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const UpdateInventoryPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [initialData, setInitialData] = useState(location.state?.currentItem || null);

  const [formData, setFormData] = useState({
    price: "",
    stockQuantity: "",
    expiryDate: "",
    batchNumber: "",
    minStockAlert: 10,
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        price: initialData.price || "",
        stockQuantity: initialData.stockQuantity || "",
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate).toISOString().split("T")[0]
          : "",
        batchNumber: initialData.batchNumber || "",
        minStockAlert: initialData.minStockAlert || 10,
        isAvailable: initialData.isAvailable,
      });
      setLoading(false);
    } else {
      setError("Could not load item data. Please go back to the inventory list.");
      setLoading(false);
    }
  }, [initialData]);

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

    try {
      // ✨ FIXED: Correct endpoint & removed proxy conflicts
      await axios.patch(
        `https://medilocator-complete.onrender.com/api/v1/inventory/${inventoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          }
        }
      );

      setSuccess("Item updated successfully! Redirecting...");
      setTimeout(() => navigate("/store/inventory"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div
        className="flex-grow-1 p-4 vh-100"
        style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}
      >
        {initialData && <h1 className="display-5">Edit: {initialData.product.name}</h1>}
        {!initialData && <h1 className="display-5">Edit Inventory Item</h1>}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading && !error && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        {!loading && initialData && (
          <form onSubmit={handleSubmit} className="card p-4 mt-3">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Minimum Stock Alert</label>
                <input
                  type="number"
                  name="minStockAlert"
                  value={formData.minStockAlert}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check form-switch fs-5">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="form-check-input"
                    id="isAvailable"
                  />
                  <label className="form-check-label" htmlFor="isAvailable">
                    Is Available
                  </label>
                </div>
              </div>
            </div>

            <hr className="my-4" />
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-lg btn-secondary"
                onClick={() => navigate("/store/inventory")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-lg btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateInventoryPage;
