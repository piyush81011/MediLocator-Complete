import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ADD THIS
import axios from "axios";

export default function Detail() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // ADD THIS
  
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const API_BASE_URL = "https://medilocator-complete.onrender.com/api/v1";

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchTerm, selectedCategory, medicines, isLoggedIn]); // ADD isLoggedIn

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customer/all-medicines`);
      const allMedicines = res.data.data || [];
      setMedicines(allMedicines);
    } catch (err) {
      console.error("Error fetching medicines", err);
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = [...medicines];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(med => med.category === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(med =>
        med.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Limit to 8 if not logged in and no search/filter
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
    if (min === max) return `₹${min.toFixed(2)}`;
    return `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`;
  };

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
        <div className="spinner-border text-success" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading medicines...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      
      {/* Search and Filter Section - Only if logged in */}
      {isLoggedIn ? (
        <>
          <div className="row mb-4">
            <div className="col-lg-8 mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search for medicines, brands, or generic names..."
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
          <div className="alert alert-info d-inline-block">
            <strong>🔒 Unlock All Features</strong> - Login to view detailed prices and store locations
          </div>
        </div>
      )}

      {/* Medicine Cards */}
      <div className="row g-4">
        {filteredMedicines.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div style={{ fontSize: "5rem" }}>💊</div>
            <h5 className="mt-3">No medicines found</h5>
          </div>
        ) : (
          filteredMedicines.map((medicine) => (
            <div key={medicine._id} className="col-md-6 col-lg-4 col-xl-3">
              <div 
                className="card h-100 shadow-sm border-0 position-relative" 
                style={{ 
                  transition: "all 0.3s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
                onClick={() => handleMedicineClick(medicine)}
              >
                {/* Lock Badge for Non-Logged Users */}
                {!isLoggedIn && (
                  <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                    <span className="badge bg-warning text-dark">
                      🔒 Login to Compare
                    </span>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark fw-bold mb-2">
                    {medicine.productName}
                  </h5>
                  
                  <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                    <strong>Brand:</strong> {medicine.brand}
                  </p>

                  {medicine.genericName && (
                    <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                      <strong>Generic:</strong> {medicine.genericName}
                    </p>
                  )}

                  <div className="mb-3">
                    <span className="badge bg-info me-2">{medicine.category}</span>
                    {medicine.requiresPrescription && (
                      <span className="badge bg-warning text-dark">Rx</span>
                    )}
                  </div>

                  <div className="mt-auto">
                    {isLoggedIn ? (
                      <>
                        {/* Logged In - Show Price Range */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">Price Range:</small>
                          <span className="badge bg-success fs-6">
                            {getPriceRange(medicine.stores)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            Available at <strong>{medicine.stores.length}</strong> store(s)
                          </small>
                        </div>
                        <button 
                          className="btn btn-outline-success w-100"
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
                        {/* Not Logged In - Show Locked Price */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">Starting from:</small>
                          <span className="badge bg-secondary fs-6" style={{ filter: "blur(4px)" }}>
                            ₹{getMinPrice(medicine.stores).toFixed(2)}
                          </span>
                        </div>
                        <div className="alert alert-warning py-2 mb-3" style={{ fontSize: "0.85rem" }}>
                          <strong>🔒 Unlock Prices</strong><br />
                          Login to see detailed pricing
                        </div>
                        <button 
                          className="btn btn-success w-100"
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

      {/* Call to Action for Non-Logged Users */}
      {!isLoggedIn && filteredMedicines.length > 0 && (
        <div className="text-center mt-5 py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "15px" }}>
          <div className="text-white">
            <h2 className="fw-bold mb-3">Want to See All {medicines.length} Medicines?</h2>
            <p className="lead mb-4">
              Login now to unlock full access, compare prices across stores, and save money!
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                className="btn btn-light btn-lg px-5"
                onClick={() => navigate("/login")}
              >
                <strong>Login Now</strong>
              </button>
              <button 
                className="btn btn-outline-light btn-lg px-5"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
            </div>
            <div className="mt-4">
              <small className="text-white-50">
                ✓ Compare prices • ✓ Find nearby stores • ✓ Save money
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
