// src/components/SearchProducts.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api"; // your axios instance
import "./SearchProducts.css"; // optional for custom styling

export default function SearchProducts() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("minPrice");
  const [order, setOrder] = useState("asc");

  const fetchResults = async (p = 1) => {
    setLoading(true);
    try {
      const params = {
        q,
        category: category || undefined,
        page: p,
        limit,
        sortBy,
        order
      };
      const res = await api.get("/products/search", { params });
      const data = res.data.data;
      setProducts(data.products || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Search error:", err?.response?.data || err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch when component mounts (optional) or when search pressed
  }, []);

  const onSearch = (e) => {
    e?.preventDefault();
    setPage(1);
    fetchResults(1);
  };

  return (
    <div className="container py-4">
      <h2>Search Medicines</h2>

      <form className="row g-2 align-items-center mb-3" onSubmit={onSearch}>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Search product name, brand or generic..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option value="medicine">Medicine</option>
            <option value="equipment">Equipment</option>
            <option value="supplement">Supplement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-md-2">
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="minPrice">Lowest price</option>
            <option value="maxPrice">Highest price</option>
            <option value="avgPrice">Avg price</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="col-md-1">
          <select className="form-select" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {loading && <div className="text-center py-4">Loading results...</div>}

      {!loading && products.length === 0 && <div className="text-muted">No results. Try a different query.</div>}

      <div className="row">
        {products.map((p) => (
          <div className="col-md-6 mb-4" key={p._id || p.product._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h5 className="card-title mb-0">{p.product.name}</h5>
                    <small className="text-muted">{p.product.brand} • {p.product.genericName || "N/A"}</small>
                  </div>
                  <div className="text-end">
                    <div style={{ fontSize: "14px", color: "#555" }}>Stores: {p.totalStores}</div>
                    <div>
                      <strong>₹{p.minPrice?.toFixed(2)}</strong>
                      <div className="small text-muted">min</div>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="badge bg-secondary me-2">{p.product.category}</span>
                  {p.product.requiresPrescription && <span className="badge bg-warning text-dark">Prescription</span>}
                </div>

                <div className="mb-2">
                  <strong>Price stats:</strong>
                  <div className="d-flex gap-3 mt-1">
                    <div>Min: ₹{p.minPrice?.toFixed(2)}</div>
                    <div>Max: ₹{p.maxPrice?.toFixed(2)}</div>
                    <div>Avg: ₹{p.avgPrice?.toFixed(2)}</div>
                  </div>
                </div>

                <hr />

                <div>
                  <strong>Stores</strong>
                  <div className="list-group mt-2">
                    {p.stores.map((s, idx) => (
                      <div key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold">{s.name}</div>
                          <div className="small text-muted">
                            {s.phone ? `📞 ${s.phone}` : ""} {s.email ? ` • ✉ ${s.email}` : ""} {s.address ? ` • ${s.address}` : ""}
                          </div>
                        </div>

                        <div className="text-end">
                          <div className="fw-bold">₹{(s.price || 0).toFixed(2)}</div>
                          <div className="small">
                            {s.stockQuantity > 0 ? `${s.stockQuantity} in stock` : "Out"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <nav aria-label="search pagination">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchResults(p); }}>
                Prev
              </button>
            </li>
            <li className="page-item disabled"><span className="page-link">{page} / {pages}</span></li>
            <li className={`page-item ${page === pages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => { const p = Math.min(pages, page + 1); setPage(p); fetchResults(p); }}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
