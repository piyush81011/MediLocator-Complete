import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import api from "../utils/api"; // Make sure you create the api.js file
import { useNavigate } from "react-router-dom";

const SearchCatalog = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // This hook searches the API as you type
  useEffect(() => {
    // Don't search if the bar is empty
    if (search.trim() === "") {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // This timer waits 300ms after you stop typing to search
    const delayDebounce = setTimeout(async () => {
      try {
        // Calls GET /api/v1/catalog/search?search=...
        const res = await api.get("/catalog/search", {
          params: { search: search },
        });
        setProducts(res.data.data.products);
      } catch (err) {
        setError("Failed to search products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms delay

    // Clear the timer if the user types again
    return () => clearTimeout(delayDebounce);
  }, [search]); // Re-run this effect every time 'search' changes

  const handleAddProduct = (product) => {
    // This navigates to the AddStock page, passing the product
    // It matches the route: /store/add-stock/:medicineId
    navigate(`/store/add-stock/${product._id}`, { state: { medicine: product } });
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-5">Search Master Catalog</h1>
        <p className="lead">Find a product to add to your store's inventory.</p>
        
        <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2 my-4">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Start typing to search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </form>

        {error && <p className="alert alert-danger">{error}</p>}

        <div className="list-group">
          {/* Show "No products" message only after searching */}
          {!loading && products.length === 0 && search.trim() !== "" && (
            <div className="list-group-item text-center p-4">
              <h4 className="mb-3">No products found for "{search}".</h4>
              <button
                className="btn btn-success"
                onClick={() => navigate("/store/request-product")} // Route from your App.jsx
              >
                Request This Product to be Added
              </button>
            </div>
          )}
          
          {products.map((product) => (
            <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" key={product._id}>
              <div>
                <h5 className="mb-1">{product.name}</h5>
                <p className="mb-1"><strong>Brand:</strong> {product.brand} | <strong>Generic:</strong> {product.genericName || "N/A"}</p>
                <small>Pack Size: {product.packSize}</small>
              </div>
              <button
                className="btn btn-success"
                onClick={() => handleAddProduct(product)}
              >
                + Add to My Inventory
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCatalog;