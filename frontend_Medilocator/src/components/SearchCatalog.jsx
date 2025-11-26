import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ProductCatalogSearch = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim() === "") {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get("https://medilocator-complete.onrender.com/catalog/search", {
          params: { search: search },
        });
        setProducts(res.data.data.products);
      } catch (err) {
        setError("Failed to search products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [search]); 

  // --- THIS IS THE FIX ---
  // The navigate call now includes the product._id to match your App.jsx route
  const handleAddProduct = (product) => {
    navigate(`/store/add-stock/${product._id}`, { state: { medicine: product } });
  };
  // --- END OF FIX ---

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-6 fw-bold">Search Master Catalog</h1>
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
          {!loading && products.length === 0 && search.trim() !== "" && (
            <div className="list-group-item text-center p-4">
              <h4 className="mb-3">No products found for "{search}".</h4>
              <button
                className="btn btn-success"
                onClick={() => navigate("/store/request-product")} // This path must be in your App.jsx
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
                onClick={() => handleAddProduct(product)} // This will now work
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

export default ProductCatalogSearch;