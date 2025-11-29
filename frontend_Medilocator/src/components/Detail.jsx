import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import api from "../utils/api";

export default function Detail() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchTerm, selectedCategory, medicines, isLoggedIn]);

  const loadMedicines = async () => {
    try {
     const res = await api.get("/customer/all-medicines");;
      setMedicines(res.data.data || []);
    } catch (err) {
      console.error("Error fetching medicines", err);
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = [...medicines];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((med) => med.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (med) =>
          med.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (!isLoggedIn && !searchTerm && selectedCategory === "all") {
      filtered = filtered.slice(0, 8);
    }

    setFilteredMedicines(filtered);
  };

  const getMinPrice = (stores) =>
    stores?.length ? Math.min(...stores.map((s) => s.price)) : 0;

  const getPriceRange = (stores) => {
    if (!stores?.length) return "N/A";
    const min = Math.min(...stores.map((s) => s.price));
    const max = Math.max(...stores.map((s) => s.price));
    return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
  };

  const handleMedicineClick = (medicine) => {
    if (!isLoggedIn) navigate("/login");
    else navigate(`/medicine/${medicine._id}`, { state: { medicine } });
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-success"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <p className="mt-3 text-muted">Loading medicines...</p>
      </div>
    );

  return (
    <div className="container my-4">

      {/* TOP SECTION (Responsive Search + Filter) */}
      {isLoggedIn ? (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select form-select-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="medicine">Medicine</option>
                <option value="equipment">Equipment</option>
                <option value="supplement">Supplement</option>
              </select>
            </div>
          </div>

          <p className="text-muted mb-4">
            Showing {filteredMedicines.length} result(s)
          </p>
        </>
      ) : (
        <div className="text-center mb-4 px-2">
          <h3 className="fw-bold">Popular Medicines</h3>
          <p className="text-muted">
            Login to see all medicines and compare prices
          </p>
          <div className="alert alert-info d-inline-block small w-100 w-md-auto">
            <strong>🔒 Unlock All Features</strong> — Login to continue
          </div>
        </div>
      )}

      {/* MEDICINE CARDS (Fully Responsive Grid) */}
      <div className="row g-3 g-md-4">
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem" }}>💊</div>
            <h5 className="mt-3">No medicines found</h5>
          </div>
        ) : (
          filteredMedicines.map((medicine) => (
            <div
              key={medicine._id}
              className="col-6 col-md-4 col-lg-3"
              onClick={() => handleMedicineClick(medicine)}
            >
              <div
                className="card h-100 shadow-sm border-0 position-relative"
                style={{ cursor: "pointer", borderRadius: "12px" }}
              >
                {!isLoggedIn && (
                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                    🔒 Login
                  </span>
                )}

                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold text-dark mb-1">
                    {medicine.productName}
                  </h6>
                  <p className="text-muted small mb-1">
                    <strong>Brand:</strong> {medicine.brand}
                  </p>

                  {medicine.genericName && (
                    <p className="text-muted small mb-2">
                      <strong>Generic:</strong> {medicine.genericName}
                    </p>
                  )}

                  <div className="mb-2">
                    <span className="badge bg-primary me-2">
                      {medicine.category}
                    </span>
                    {medicine.requiresPrescription && (
                      <span className="badge bg-warning text-dark">Rx</span>
                    )}
                  </div>

                  <div className="mt-auto">
                    {isLoggedIn ? (
                      <>
                        <div className="d-flex justify-content-between small mb-2">
                          <span className="text-muted">Price Range:</span>
                          <span className="badge bg-success">
                            {getPriceRange(medicine.stores)}
                          </span>
                        </div>
                        <button className="btn btn-outline-success w-100 btn-sm">
                          Compare Prices
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between small mb-2">
                          <span className="text-muted">Starting from:</span>
                          <span
                            className="badge bg-secondary"
                            style={{ filter: "blur(3px)" }}
                          >
                            ₹{getMinPrice(medicine.stores)}
                          </span>
                        </div>
                        <button
                          className="btn btn-success w-100 btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/login");
                          }}
                        >
                          Login to Unlock
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA SECTION (Responsive) */}
      {!isLoggedIn && filteredMedicines.length > 0 && (
        <div
          className="text-center mt-5 p-4 p-md-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "20px",
          }}
        >
          <h3 className="fw-bold mb-2">
            Want to See All {medicines.length} Medicines?
          </h3>
          <p className="lead mb-4">
            Login to unlock full access and compare prices instantly.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button
              className="btn btn-light btn-lg px-4"
              onClick={() => navigate("/login")}
            >
              Login Now
            </button>
            <button
              className="btn btn-outline-light btn-lg px-4"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
