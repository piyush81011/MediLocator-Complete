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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 🔥 Only fetch medicines
        const res = await axios.get("https://medilocator-complete.onrender.com/catalog?category=medicine");

        console.log("API Response:", res.data);

        // Backend response format fix
        const productList =
          res.data?.data?.products ||
          res.data?.products ||
          res.data ||
          [];

        setProducts(productList);
      } catch (err) {
        setError("Failed to load master catalog.");
        console.error("Catalog Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />

      <div
        className="flex-grow-1 p-4 vh-100"
        style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Master Product Catalog</h1>

          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate("/admin/master-catalog/add")}
          >
            + Add New Product
          </button>
        </div>

        <p className="text-secondary mb-4">
          Central repository of all <b>medicines</b> available in the MediLocator platform.
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* No products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-5 text-muted">
            <h4>No medicines found</h4>
            <p>Add medicine products to build your catalog.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/master-catalog/add")}
            >
              + Add First Medicine
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && products.length > 0 && (
          <div className="card shadow-sm">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Generic Name</th>
                  <th>Category</th>
                  <th>Prescription</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.brand}</td>
                    <td>{p.genericName || "N/A"}</td>
                    <td>
                      <span className="badge bg-secondary">{p.category}</span>
                    </td>
                    <td>{p.requiresPrescription ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterCatalogAdmin;
