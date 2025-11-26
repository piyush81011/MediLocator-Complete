import "../styles/formStyles.css";
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";


const SearchCatalog = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axios.get("https://medilocator-complete.onrender.com/catalog/search", {
          params: { search },
        });
        setProducts(res.data.data.products);
      } catch {
        setError("Search failed");
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">

        <h1 className="display-5 fw-bold">Search Master Catalog</h1>
        <p className="lead">Find a product to add to your store's inventory.</p>

        {/* Modern Search Bar */}
        <div className="search-wrapper my-4">
          <i className="bi bi-search"></i>
          <input
            type="text"
            className="form-control form-control-lg catalog-search-input with-icon"
            placeholder="Search medicines, tablets, syrups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {products.length === 0 && search.trim() !== "" && (
          <div className="alert alert-warning text-center py-4">
            <h4>No products found for "{search}".</h4>
            <button
              className="btn btn-success btn-lg mt-3"
              onClick={() => navigate("/store/request-product")}
            >
              Request This Product to be Added
            </button>
          </div>
        )}

        {/* Results */}
        <div className="list-group">
          {products.map((p) => (
            <div
              key={p._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 className="mb-1">{p.name}</h5>
                <small className="text-muted">
                  Brand: {p.brand} | Generic: {p.genericName || "N/A"}
                </small>
                <br />
                <small className="text-muted">Pack Size: {p.packSize}</small>
              </div>

              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/store/add-stock/${p._id}`, { state: { medicine: p } })
                }
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