import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MedicineDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const medicine = location.state?.medicine;

  if (!medicine) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <div className="text-center">
          <div className="mb-4" style={{ fontSize: "4rem" }}>💊</div>
          <h4 className="text-dark mb-3">Medicine Not Found</h4>
          <p className="text-muted mb-4">The medicine you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary px-4 py-2" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const sortedStores = [...medicine.stores].sort((a, b) => a.price - b.price);
  const minPrice = Math.min(...medicine.stores.map(s => s.price));
  const maxPrice = Math.max(...medicine.stores.map(s => s.price));
  const savings = maxPrice - minPrice;

  const openMaps = (store) => {
    const destination = store.latitude && store.longitude 
      ? `${store.latitude},${store.longitude}`
      : encodeURIComponent(store.address || store.storeName);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank");
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div className="container py-4">
        
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <span>←</span> Back to Results
          </button>
          
          {savings > 0 && (
            <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 fs-6 d-none d-md-block">
              💰 You can save ₹{savings.toFixed(0)} by comparing!
            </div>
          )}
        </div>

        {/* Medicine Details Card */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge text-primary px-3 py-2" style={{ backgroundColor: "#e0f2fe" }}>
                    {medicine.category}
                  </span>
                  {medicine.requiresPrescription && (
                    <span className="badge text-warning px-3 py-2" style={{ backgroundColor: "#fef3c7" }}>
                      ⚠️ Prescription Required
                    </span>
                  )}
                </div>
                
                <h2 className="fw-bold text-dark mb-2">{medicine.productName}</h2>
                <p className="text-muted mb-1">
                  <span className="fw-medium">Brand:</span> {medicine.brand}
                </p>
                {medicine.genericName && (
                  <p className="text-muted mb-0">
                    <span className="fw-medium">Generic:</span> {medicine.genericName}
                  </p>
                )}
              </div>
              
              <div className="col-lg-4 mt-4 mt-lg-0">
                <div className="text-center p-4" style={{ backgroundColor: "#f0fdf4", borderRadius: "12px" }}>
                  <p className="text-muted small mb-2">Best Available Price</p>
                  <h2 className="text-success fw-bold mb-1">₹{minPrice.toFixed(0)}</h2>
                  {maxPrice > minPrice && (
                    <p className="text-muted small mb-0">
                      Range: ₹{minPrice.toFixed(0)} - ₹{maxPrice.toFixed(0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="mb-3">
          <h5 className="fw-bold text-dark mb-0">
            📍 Available at {medicine.stores.length} Nearby Store{medicine.stores.length > 1 ? 's' : ''}
          </h5>
          <p className="text-muted small">Sorted by lowest price first</p>
        </div>

        {/* Store Cards */}
        <div className="row g-3">
          {sortedStores.map((store, index) => (
            <div key={index} className="col-12">
              <div 
                className="card border-0 shadow-sm" 
                style={{ 
                  borderRadius: "10px",
                  borderLeft: index === 0 ? "4px solid #22c55e" : "none"
                }}
              >
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    
                    {/* Rank & Store Name */}
                    <div className="col-12 col-md-4 mb-2 mb-md-0">
                      <div className="d-flex align-items-center gap-2">
                        <span 
                          className="badge rounded-pill px-2 py-1"
                          style={{ 
                            backgroundColor: index === 0 ? "#22c55e" : "#e2e8f0",
                            color: index === 0 ? "white" : "#64748b",
                            fontSize: "12px"
                          }}
                        >
                          {index === 0 ? "🏆 Best" : `#${index + 1}`}
                        </span>
                        <div>
                          <h6 className="fw-semibold text-dark mb-0">{store.storeName}</h6>
                          <small className="text-muted">
                            {store.address || "Address not available"}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="col-6 col-md-3 mb-2 mb-md-0">
                      <div className="d-flex gap-4">
                        <div>
                          <small className="text-muted d-block">Price</small>
                          <span className={`fw-bold fs-5 ${index === 0 ? "text-success" : "text-dark"}`}>
                            ₹{store.price.toFixed(0)}
                          </span>
                        </div>
                        <div>
                          <small className="text-muted d-block">Stock</small>
                          <span className={`badge ${store.stock > 10 ? "bg-success" : store.stock > 0 ? "bg-warning" : "bg-danger"}`}>
                            {store.stock} units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="col-6 col-md-2 mb-2 mb-md-0">
                      <small className="text-muted d-block">Expiry</small>
                      <span>{new Date(store.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-12 col-md-3">
                      <div className="d-flex gap-2 justify-content-md-end">
                        {(store.contactNo || store.phone) && (
                          <a 
                            href={`tel:${store.contactNo || store.phone}`}
                            className="btn btn-outline-secondary d-flex align-items-center gap-1"
                          >
                            📞 Call
                          </a>
                        )}
                        <button
                          className="btn btn-primary d-flex align-items-center gap-2"
                          onClick={() => openMaps(store)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.293V.5A.5.5 0 0 1 8 0z" transform="rotate(-45 8 8)"/>
                          </svg>
                          Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="text-center mt-4 py-4">
          <p className="text-muted small mb-0">
            💡 Prices may vary. Please confirm with the store before visiting.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MedicineDetailPage;