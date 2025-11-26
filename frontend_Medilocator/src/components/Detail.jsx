import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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

  // LOAD MEDICINES
  const loadMedicines = async () => {
    setLoading(true);
    try {
      // ✔ Correct proxy-safe URL
      const res = await axios.get("/api/v1/customer/all-medicines");

      const allMedicines = res.data.data || [];
      setMedicines(allMedicines);

    } catch (err) {
      console.error("Error fetching medicines", err);
    } finally {
      setLoading(false);
    }
  };

  // FILTER RESULTS
  const filterMedicines = () => {
    let filtered = [...medicines];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(med => med.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(med =>
        med.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Limit for guests
    if (!isLoggedIn && !searchTerm && selectedCategory === "all") {
      filtered = filtered.slice(0, 8);
    }

    setFilteredMedicines(filtered);
  };

  const getMinPrice = (stores) => {
    if (!stores || stores.length === 0) return 0;
    return Math.min(...stores.map(s => s.price));
  };

  const getPriceRange = (stores) => {
    if (!stores || stores.length === 0) return "N/A";
    const min = Math.min(...stores.map(s => s.price));
    const max = Math.max(...stores.map(s => s.price));
    return min === max ? `₹${min.toFixed(2)}` : `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`;
  };

  // CLICK HANDLER
  const handleMedicineClick = (medicine) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/medicine/${medicine._id}`, { state: { medicine } });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted">Loading medicines...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">

      {/* SEARCH BAR (only if logged in) */}
      {isLoggedIn ? (
        <>
          <div className="row mb-4">
            <div className="col-lg-8 mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
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
            Showing {filteredMedicines.length} medicine(s)
          </p>
        </>
      ) : (
        <div className="text-center mb-4">
          <h3 className="fw-bold">Popular Medicines</h3>
          <p className="text-muted">Login to see all medicines and compare prices across stores</p>
        </div>
      )}

      {/* MEDICINE CARDS */}
      <div className="row g-4">
        {filteredMedicines.length === 0 ? (
          <div className="col-12 text-center py-5">
            <h5>No medicines found</h5>
          </div>
        ) : (
          filteredMedicines.map((medicine) => (
            <div key={medicine._id} className="col-md-6 col-lg-4 col-xl-3">
              <div
                className="card h-100 shadow-sm border-0"
                style={{ cursor: "pointer" }}
                onClick={() => handleMedicineClick(medicine)}
              >
                {!isLoggedIn && (
                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                    🔒 Login to Compare
                  </span>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{medicine.productName}</h5>
                  <p className="text-muted mb-2">
                    <strong>Brand:</strong> {medicine.brand}
                  </p>

                  <div className="mt-auto">
                    {isLoggedIn ? (
                      <>
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Price Range:</small>
                          <span className="badge bg-success fs-6">
                            {getPriceRange(medicine.stores)}
                          </span>
                        </div>

                        <button
                          className="btn btn-outline-success w-100 mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/medicine/${medicine._id}`, { state: { medicine } });
                          }}
                        >
                          Compare Prices
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Starting from:</small>
                          <span
                            className="badge bg-secondary fs-6"
                            style={{ filter: "blur(4px)" }}
                          >
                            ₹{getMinPrice(medicine.stores).toFixed(2)}
                          </span>
                        </div>

                        <button
                          className="btn btn-success w-100 mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/login");
                          }}
                        >
                          Login to View Prices
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

      {/* CTA for non-logged in users */}
      {!isLoggedIn && filteredMedicines.length > 0 && (
        <div className="text-center mt-5 py-5 bg-primary text-white rounded">
          <h2 className="fw-bold mb-3">Want to See All {medicines.length} Medicines?</h2>
          <p className="lead mb-4">Login now to unlock full access!</p>

          <button className="btn btn-light btn-lg me-3" onClick={() => navigate("/login")}>
            Login Now
          </button>
          <button className="btn btn-outline-light btn-lg" onClick={() => navigate("/signup")}>
            Create Account
          </button>
        </div>
      )}
    </div>
  );
}
