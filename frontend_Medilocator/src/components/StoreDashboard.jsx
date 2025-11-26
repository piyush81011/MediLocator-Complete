import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "./AdminSidebar"; // Make sure this path is correct

// This component is your "My Inventory" page
const StoreDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // This function fetches your inventory from the API
  const fetchInventory = async () => {
    setLoading(true);
    try {
      // This calls your 'getStoreInventory' controller
      const res = await axios.get("https://medilocator-complete.onrender.com//inventory/"); 
      setInventory(res.data.data.inventory);
      setError(null);
    } catch (err) {
      setError("Failed to fetch inventory. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // This tells React to run fetchInventory() once when the page loads
  useEffect(() => {
    fetchInventory();
  }, []);

  // Function for the delete button
  const handleDelete = async (inventoryId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // This calls your 'deleteInventoryItem' controller
        await axios.delete(`https://medilocator-complete.onrender.com/inventory/${inventoryId}`);
        // Refresh the list after deleting
        fetchInventory(); 
      } catch (err) {
        setError("Failed to delete item.");
      }
    }
  };

  // Function for the update button
  const handleEdit = (item) => {
    // Navigate to the edit page (you will need to create this route/page)
    // We pass the item data to the next page to pre-fill the form
    navigate(`/store/inventory/edit/${item._id}`, { state: { currentItem: item } });
  };

  return (
    // This is the main page layout, using Bootstrap's flex utilities
    <div className="d-flex vh-100">
      
      {/* 1. The Sidebar is placed here */}
      <AdminSidebar />
      
      {/* 2. This is the main content area */}
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="display-6 fw-bold">My Inventory</h1>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => navigate("/store/catalog-search")} // Corrected route from your App.jsx
          >
            + Add New Product
          </button>
        </div>
        <p className="lead">Manage your store's product pricing, stock, and expiry.</p>

        {/* Show loading spinner or error message */}
        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <p className="alert alert-danger">{error}</p>}

        {/* This is the live data table */}
        <table className="table table-striped table-hover table-bordered mt-4">
          <thead className="table-dark">
            <tr>
              <th>Medicine Name</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Price (₹)</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* This is the most important part:
              We loop over the 'inventory' state and create a row for each item
            */}
            {!loading && inventory.map((item) => (
              <tr key={item._id} className={item.isExpired ? "table-danger" : item.isLowStock ? "table-warning" : ""}>
                
                {/* Product details come from the 'product' object inside the item */}
                <td>{item.product.name}</td>
                <td>{item.product.brand}</td>
                
                <td>
                  {item.stockQuantity}
                  {item.isLowStock && !item.isExpired && " (Low)"}
                </td>
                
                <td>{item.price.toFixed(2)}</td>
                
                <td>
                  {new Date(item.expiryDate).toLocaleDateString()}
                  {item.isExpired && " (Expired)"}
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Show this message if the inventory is empty */}
        {!loading && inventory.length === 0 && (
          <div className="text-center p-5 card">
            <h4>Your inventory is empty.</h4>
            <p>Click "Add New Product" to get started.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default StoreDashboard;