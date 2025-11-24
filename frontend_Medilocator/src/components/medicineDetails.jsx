import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MedicineDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const medicine = location.state?.medicine;

  if (!medicine) {
    return (
      <div className="container py-5 text-center">
        <h3>Medicine not found</h3>
        <button className="btn btn-success mt-3" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  const sortedStores = [...medicine.stores].sort((a, b) => a.price - b.price);
  const minPrice = Math.min(...medicine.stores.map(s => s.price));
  const maxPrice = Math.max(...medicine.stores.map(s => s.price));
  const avgPrice = medicine.stores.reduce((sum, s) => sum + s.price, 0) / medicine.stores.length;

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-4">
        
        {/* Back Button */}
        <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Medicine Info Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-3">{medicine.productName}</h2>
                <div className="mb-3">
                  <p className="mb-2"><strong>Brand:</strong> {medicine.brand}</p>
                  {medicine.genericName && (
                    <p className="mb-2"><strong>Generic Name:</strong> {medicine.genericName}</p>
                  )}
                  <p className="mb-2">
                    <span className="badge bg-info me-2">{medicine.category}</span>
                    {medicine.requiresPrescription && (
                      <span className="badge bg-warning text-dark">Prescription Required</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="card bg-light border-0">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-3">Price Statistics</h6>
                    <div className="row g-3">
                      <div className="col-4">
                        <small className="text-muted d-block">Lowest</small>
                        <h5 className="text-success mb-0">₹{minPrice.toFixed(2)}</h5>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">Average</small>
                        <h5 className="text-primary mb-0">₹{avgPrice.toFixed(2)}</h5>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">Highest</small>
                        <h5 className="text-danger mb-0">₹{maxPrice.toFixed(2)}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Comparison Table */}
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">💊 Available at {medicine.stores.length} Store(s)</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "80px" }}>Rank</th>
                    <th>Store Name</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Batch No.</th>
                    <th>Expiry Date</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStores.map((store, index) => (
                    <tr key={index} className={index === 0 ? 'table-success' : ''}>
                      <td>
                        {index === 0 ? (
                          <span className="badge bg-success fs-6">
                            🏆 Best
                          </span>
                        ) : (
                          <span className="text-muted">#{index + 1}</span>
                        )}
                      </td>
                      <td>
                        <strong>{store.storeName}</strong>
                      </td>
                      <td>
                        <div>
                          <i className="bi bi-geo-alt-fill text-danger"></i>
                          <span className="ms-1">
                            {store.address || "Address not available"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className={`badge fs-6 ${
                            store.price === minPrice 
                              ? 'bg-success' 
                              : store.price === maxPrice 
                              ? 'bg-danger' 
                              : 'bg-primary'
                          }`}
                        >
                          ₹{store.price.toFixed(2)}
                        </span>
                        {store.price === minPrice && (
                          <div>
                            <small className="text-success fw-bold">Lowest Price!</small>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${store.stock > 10 ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {store.stock} units
                        </span>
                      </td>
                      <td>
                        <small>{store.batchNumber || "N/A"}</small>
                      </td>
                      <td>
                        <small>{new Date(store.expiryDate).toLocaleDateString()}</small>
                      </td>
                      <td>
                        {store.contactNo || store.phone ? (
                          <a 
                            href={`tel:${store.contactNo || store.phone}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            📞 Call
                          </a>
                        ) : (
                          <small className="text-muted">N/A</small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Savings Alert */}
        {maxPrice > minPrice && (
          <div className="alert alert-success mt-4 d-flex align-items-center">
            <div style={{ fontSize: "3rem" }} className="me-3">💰</div>
            <div>
              <h5 className="mb-1">Save up to ₹{(maxPrice - minPrice).toFixed(2)}!</h5>
              <p className="mb-0">By choosing the store with the lowest price</p>
            </div>
          </div>
        )}

        {/* Store Cards for Mobile View */}
        <div className="d-md-none mt-4">
          <h5 className="mb-3">Compare Stores</h5>
          {sortedStores.map((store, index) => (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body">
                {index === 0 && (
                  <span className="badge bg-success mb-2">🏆 Best Price</span>
                )}
                <h6 className="fw-bold">{store.storeName}</h6>
                <p className="mb-2">
                  <i className="bi bi-geo-alt-fill text-danger"></i>
                  <small className="ms-1">{store.address || "Address not available"}</small>
                </p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success fs-6">₹{store.price.toFixed(2)}</span>
                  <span className="badge bg-secondary">{store.stock} units</span>
                </div>
                {(store.contactNo || store.phone) && (
                  <a 
                    href={`tel:${store.contactNo || store.phone}`} 
                    className="btn btn-sm btn-outline-primary w-100"
                  >
                    📞 Call Store
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;