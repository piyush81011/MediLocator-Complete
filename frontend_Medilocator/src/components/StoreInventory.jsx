import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "../components/AdminSidebar";

const StoreInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inventory");
      setInventory(res.data.data.inventory);
      setError(null);
    } catch (err) {
      setError("Failed to fetch inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (inventoryId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/inventory/${inventoryId}`);
        setInventory(inventory.filter((item) => item._id !== inventoryId));
      } catch (err) {
        setError("Failed to delete item.");
      }
    }
  };

  const handleEdit = (item) => {
    navigate(`/store/inventory/edit/${item._id}`, { state: { currentItem: item } });
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-5 ">My Store Inventory</h1>
        <button className="btn btn-primary my-3" onClick={() => navigate("/store/catalog-search")}>
          + Add New Product from Catalog
        </button>
        
        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <p className="alert alert-danger">{error}</p>}

        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Product Name</th>
              <th>Brand</th>
              <th>My Price</th>
              <th>Stock</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id} className={item.isExpired ? "table-danger" : item.isLowStock ? "table-warning" : ""}>
                <td>{item.product.name}</td>
                <td>{item.product.brand}</td>
                <td>₹{item.price.toFixed(2)}</td>
                <td>
                  {item.stockQuantity}
                  {item.isLowStock && !item.isExpired && " (Low)"}
                </td>
                <td>
                  {new Date(item.expiryDate).toLocaleDateString()}
                  {item.isExpired && " (Expired)"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreInventory;