import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import api from "../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/inventory/stats");
        setStats(res.data.data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f7f9fc", overflowY: "auto" }}>

        <h2 className="fw-bold">📊 Store Dashboard</h2>
        <p className="text-muted">Overview of store performance & inventory health</p>

        {/* Loader */}
        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {stats && (
          <>
            {/* TOP SUMMARY CARDS */}
            <div className="row g-4 mt-2">

              <div className="col-md-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h3 className="fw-bold text-primary">{stats.totalProducts}</h3>
                    <p className="text-muted mb-0">Total Unique Products</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h3 className="fw-bold text-warning">{stats.lowStock}</h3>
                    <p className="text-muted mb-0">Low Stock Batches</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h3 className="fw-bold text-secondary">{stats.outOfStock}</h3>
                    <p className="text-muted mb-0">Out of Stock</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h3 className="fw-bold text-danger">{stats.expired}</h3>
                    <p className="text-muted mb-0">Expired Batches</p>
                  </div>
                </div>
              </div>

            </div>

            {/* MINI CHARTS (USING PROGRESS BARS) */}
            <div className="row g-4 mt-4">

              {/* Stock Health */}
              <div className="col-md-6">
                <div className="card shadow border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">📦 Inventory Health</h5>

                    <p className="mb-1 text-muted">Low Stock</p>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${stats.lowStockPercent}%` }}
                      >
                        {stats.lowStockPercent}%
                      </div>
                    </div>

                    <p className="mb-1 text-muted">Out of Stock</p>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-secondary"
                        style={{ width: `${stats.outOfStockPercent}%` }}
                      >
                        {stats.outOfStockPercent}%
                      </div>
                    </div>

                    <p className="mb-1 text-muted">Expired</p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-danger"
                        style={{ width: `${stats.expiredPercent}%` }}
                      >
                        {stats.expiredPercent}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Expiry Status */}
              <div className="col-md-6">
                <div className="card shadow border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">⏱ Expiry Overview</h5>

                    <p className="mb-1 text-muted">Expiring Soon (30 Days)</p>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-info"
                        style={{ width: `${stats.expiringSoonPercent}%` }}
                      >
                        {stats.expiringSoonPercent}%
                      </div>
                    </div>

                    <p className="mb-1 text-muted">Healthy Stock</p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${stats.healthyStockPercent}%` }}
                      >
                        {stats.healthyStockPercent}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
