import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Modal } from "bootstrap";

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    sort: "",
  });
  const [prices, setPrices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const loadProducts = async () => {
    const res = await axios.get("https://medilocator-complete.onrender.com/search/products", { params: { ...filters, page } });
    setProducts(res.data.data.products);
    setTotalPages(res.data.data.totalPages);
  };

  const loadPrices = async (id) => {
    const res = await api.get(`/search/prices/${id}`);
    setPrices(res.data.data);
    const modal = new Modal(document.getElementById("priceModal"));
    modal.show();
  };

  useEffect(() => { loadProducts(); }, [filters, page]);

  return (
    <div className="container mt-4">
      {/* Search + Filters */}
      <div className="row g-3 mb-4">
        
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search medicines..."
            className="form-control"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="col-md-3">
          <select className="form-select"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Tablet">Tablet</option>
            <option value="Syrup">Syrup</option>
            <option value="Injection">Injection</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>

        <div className="col-md-3">
          <select className="form-select"
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="">Sort By</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
        </div>

      </div>

      {/* Product List */}
      <div className="row">
        {products.map((p) => (
          <div className="col-md-3 mb-4" key={p._id}>
            <div className="card shadow-sm h-100">

              <div className="card-body">
                <h5 className="fw-bold">{p.name}</h5>
                <p className="text-muted">{p.brand}</p>
                <p className="fw-bold text-success">Starts at ₹{p.price}</p>
              </div>

              <div className="card-footer bg-white">
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => loadPrices(p._id)}
                >
                  Compare Prices
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn ${page === i + 1 ? "btn-success" : "btn-outline-secondary"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Compare Price Modal */}
      <div className="modal fade" id="priceModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Compare Prices</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {prices.length === 0 ? (
                <p>No store has this product yet.</p>
              ) : (
                prices.map((s) => (
                  <div className="border p-2 rounded mb-2" key={s._id}>
                    <h6 className="fw-bold">{s.store.storeName}</h6>
                    <p className="text-muted">{s.store.address}</p>
                    <p className="fw-bold text-success">₹{s.price}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
