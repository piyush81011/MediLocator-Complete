import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../utils/api";
import { FaBox, FaExclamationTriangle, FaBan, FaSkull, FaClock, FaCheckCircle, FaPlus, FaReceipt, FaHistory, FaTimes, FaEdit, FaSync } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalFilter, setModalFilter] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setRefreshing(true);
    try {
      const [statsRes, inventoryRes] = await Promise.all([
        api.get("/inventory/stats"),
        api.get("/inventory/")
      ]);
      setStats(statsRes.data.data);
      setInventory(inventoryRes.data.data.inventory || []);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const store = localStorage.getItem("store");
    if (store) {
      try {
        const storeData = JSON.parse(store);
        setStoreName(storeData.storeName || storeData.name || "My Store");
      } catch {
        setStoreName("My Store");
      }
    }

    fetchData();
  }, [fetchData]);

  // Refresh data when window gains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchData(false);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

  // Helper function to check if item is expired (use backend flag or calculate)
  const isExpired = (item) => {
    if (item.isExpired !== undefined) return item.isExpired;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    return expiry < today;
  };

  // Helper function to check if item is low stock (use backend flag or calculate)
  const isLowStock = (item) => {
    if (item.isLowStock !== undefined) return item.isLowStock;
    const minAlert = item.minStockAlert || 10;
    return item.stockQuantity > 0 && item.stockQuantity <= minAlert;
  };

  // Helper function to check if expiring soon (within 30 days)
  const isExpiringSoon = (item) => {
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  const getFilteredItems = () => {
    switch (modalFilter) {
      case "low":
        return inventory.filter(item => isLowStock(item) && !isExpired(item));
      case "expired":
        return inventory.filter(item => isExpired(item));
      case "outOfStock":
        return inventory.filter(item => item.stockQuantity === 0);
      case "expiringSoon":
        return inventory.filter(item => isExpiringSoon(item) && !isExpired(item));
      case "all":
      default:
        return inventory;
    }
  };

  const openModal = (filter, title) => {
    setModalFilter(filter);
    setModalTitle(title);
    setShowModal(true);
  };

  const StatCard = ({ icon, value, label, color, bgColor, onClick }) => (
    <div className="col-6 col-lg-3 mb-3">
      <div 
        className="card border-0 h-100" 
        style={{ backgroundColor: bgColor, borderRadius: "16px", cursor: onClick ? "pointer" : "default", transition: "transform 0.2s" }}
        onClick={onClick}
        onMouseOver={(e) => onClick && (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => onClick && (e.currentTarget.style.transform = "scale(1)")}
      >
        <div className="card-body p-3">
          <div className="d-flex align-items-center">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "50px", height: "50px", backgroundColor: color, color: "white" }}
            >
              {icon}
            </div>
            <div>
              <h3 className="fw-bold mb-0" style={{ color: color }}>{value}</h3>
              <small className="text-muted">{label}</small>
            </div>
          </div>
          {onClick && <small className="text-muted d-block mt-2">Click to view →</small>}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon, label, onClick, color }) => (
    <button 
      onClick={onClick}
      className="btn d-flex flex-column align-items-center justify-content-center p-3 border-0 h-100 w-100"
      style={{ backgroundColor: "#f8f9fa", borderRadius: "12px", transition: "all 0.2s" }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
    >
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center mb-2"
        style={{ width: "45px", height: "45px", backgroundColor: color, color: "white" }}
      >
        {icon}
      </div>
      <small className="text-dark fw-medium">{label}</small>
    </button>
  );

  const ItemModal = () => {
    const items = getFilteredItems();
    
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        onClick={() => setShowModal(false)}
      >
        <div 
          className="bg-white rounded-4 shadow-lg"
          style={{ width: "90%", maxWidth: "600px", maxHeight: "80vh", overflow: "hidden" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="fw-bold mb-0">{modalTitle}</h5>
            <button className="btn btn-sm btn-light rounded-circle" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
          </div>
          
          {/* Modal Body */}
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {items.length === 0 ? (
              <div className="text-center p-5 text-muted">
                <FaCheckCircle size={40} className="mb-3 text-success" />
                <p>No items in this category!</p>
              </div>
            ) : (
              <div className="p-3">
                {items.map((item) => (
                  <div 
                    key={item._id} 
                    className={`card mb-2 ${item.isExpired ? "border-danger" : item.isLowStock ? "border-warning" : ""}`}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold mb-1">{item.product?.name || "Unknown"}</h6>
                          <small className="text-muted">{item.product?.brand || "N/A"}</small>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setShowModal(false);
                            navigate(`/store/inventory/edit/${item._id}`, { state: { currentItem: item } });
                          }}
                        >
                          <FaEdit className="me-1" /> Update
                        </button>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between flex-wrap small">
                        <span>
                          <strong>Stock:</strong> {item.stockQuantity}
                          {isLowStock(item) && !isExpired(item) && <span className="badge bg-warning ms-1">Low</span>}
                          {item.stockQuantity === 0 && <span className="badge bg-secondary ms-1">Out</span>}
                        </span>
                        <span><strong>Price:</strong> ₹{item.price?.toFixed(2)}</span>
                        <span>
                          <strong>Expiry:</strong> {new Date(item.expiryDate).toLocaleDateString()}
                          {isExpired(item) && <span className="badge bg-danger ms-1">Expired</span>}
                          {isExpiringSoon(item) && !isExpired(item) && <span className="badge bg-warning ms-1">Soon</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="p-3 border-top bg-light">
            <small className="text-muted">Total: {items.length} items</small>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ backgroundColor: "#f0f2f5", overflowY: "auto" }}>
        
        {/* Welcome Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-1">Welcome back! 👋</h4>
            <p className="text-muted mb-0">{storeName} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button 
            className="btn btn-outline-secondary btn-sm d-flex align-items-center"
            onClick={() => fetchData(false)}
            disabled={refreshing}
          >
            <FaSync className={`me-1 ${refreshing ? "fa-spin" : ""}`} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading dashboard...</p>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {stats && (
          <>
            {/* Quick Actions */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-body p-3">
                <h6 className="fw-bold text-muted mb-3">⚡ Quick Actions</h6>
                <div className="row g-2">
                  <div className="col-4">
                    <QuickAction 
                      icon={<FaPlus />} 
                      label="Add Stock" 
                      onClick={() => navigate("/store/catalog-search")}
                      color="#0d6efd"
                    />
                  </div>
                  <div className="col-4">
                    <QuickAction 
                      icon={<FaReceipt />} 
                      label="New Bill" 
                      onClick={() => navigate("/store/billing/new")}
                      color="#198754"
                    />
                  </div>
                  <div className="col-4">
                    <QuickAction 
                      icon={<FaHistory />} 
                      label="Sales" 
                      onClick={() => navigate("/store/billing/history")}
                      color="#6f42c1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <h6 className="fw-bold text-muted mb-3">📊 Inventory Overview <small className="text-primary">(Click to view details)</small></h6>
            <div className="row">
              <StatCard 
                icon={<FaBox size={20} />}
                value={stats.totalProducts}
                label="Total Products"
                color="#0d6efd"
                bgColor="#e7f1ff"
                onClick={() => openModal("all", "📦 All Products")}
              />
              <StatCard 
                icon={<FaExclamationTriangle size={20} />}
                value={stats.lowStock}
                label="Low Stock"
                color="#fd7e14"
                bgColor="#fff4e6"
                onClick={() => openModal("low", "⚠️ Low Stock Items")}
              />
              <StatCard 
                icon={<FaBan size={20} />}
                value={stats.outOfStock}
                label="Out of Stock"
                color="#6c757d"
                bgColor="#f1f3f5"
                onClick={() => openModal("outOfStock", "🚫 Out of Stock Items")}
              />
              <StatCard 
                icon={<FaSkull size={20} />}
                value={stats.expired}
                label="Expired"
                color="#dc3545"
                bgColor="#ffe5e5"
                onClick={() => openModal("expired", "❌ Expired Items")}
              />
            </div>

            {/* Health Overview */}
            <div className="row g-3 mt-2">
              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-4">📦 Stock Health</h6>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-success fw-medium">Healthy</small>
                          <small className="fw-bold">{stats.healthyStockPercent}%</small>
                        </div>
                        <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                          <div className="progress-bar bg-success" style={{ width: `${stats.healthyStockPercent}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-warning fw-medium">Low Stock</small>
                          <small className="fw-bold">{stats.lowStockPercent}%</small>
                        </div>
                        <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                          <div className="progress-bar bg-warning" style={{ width: `${stats.lowStockPercent}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-danger fw-medium">Critical</small>
                          <small className="fw-bold">{stats.outOfStockPercent}%</small>
                        </div>
                        <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                          <div className="progress-bar bg-danger" style={{ width: `${stats.outOfStockPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-4">⏰ Expiry Status</h6>
                    
                    <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded" style={{ backgroundColor: "#fff4e6", cursor: "pointer" }} onClick={() => openModal("expiringSoon", "⏰ Expiring Soon (30 Days)")}>
                      <div className="d-flex align-items-center">
                        <FaClock className="text-warning me-2" />
                        <span className="fw-medium">Expiring Soon</span>
                      </div>
                      <span className="badge bg-warning text-dark px-3 py-2">{stats.expiringSoonPercent}%</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded" style={{ backgroundColor: "#ffe5e5", cursor: "pointer" }} onClick={() => openModal("expired", "❌ Expired Items")}>
                      <div className="d-flex align-items-center">
                        <FaSkull className="text-danger me-2" />
                        <span className="fw-medium">Expired</span>
                      </div>
                      <span className="badge bg-danger px-3 py-2">{stats.expiredPercent}%</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: "#d4edda" }}>
                      <div className="d-flex align-items-center">
                        <FaCheckCircle className="text-success me-2" />
                        <span className="fw-medium">Safe Stock</span>
                      </div>
                      <span className="badge bg-success px-3 py-2">{100 - stats.expiringSoonPercent - stats.expiredPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Banner */}
            {(stats.lowStock > 0 || stats.expired > 0) && (
              <div className="alert alert-warning border-0 mt-4 d-flex align-items-center" style={{ borderRadius: "12px" }}>
                <FaExclamationTriangle className="me-2" />
                <span>
                  {stats.expired > 0 && <strong>{stats.expired} expired items</strong>}
                  {stats.expired > 0 && stats.lowStock > 0 && " and "}
                  {stats.lowStock > 0 && <strong>{stats.lowStock} low stock items</strong>}
                  {" "}need your attention!
                </span>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && <ItemModal />}
      </div>
    </div>
  );
};

export default AdminDashboard;
