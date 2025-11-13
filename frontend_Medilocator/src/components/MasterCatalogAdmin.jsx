import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../utils/api"; 

const MasterCatalogAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // This hits the GET /api/v1/catalog/ route
        const res = await api.get("/catalog"); 
        setProducts(res.data.data.products);
      } catch (err) {
        setError("Failed to load master catalog.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="display-5">Master Product Catalog</h1>
          <button 
            className="btn btn-lg btn-success" 
            onClick={() => navigate("/admin/master-catalog/add")}
          >
            + Add New Product
          </button>
        </div>
        <p className="lead">This is the central list of all products available on the platform.</p>

        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <p className="alert alert-danger">{error}</p>}
        
        <div className="card shadow-sm mt-3">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Generic Name</th>
                <th>Category</th>
                <th>Prescription?</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.genericName || 'N/A'}</td>
                  <td><span className="badge text-bg-secondary">{product.category}</span></td>
                  <td>{product.requiresPrescription ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterCatalogAdmin;