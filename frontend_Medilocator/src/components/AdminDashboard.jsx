import React, { useState, useEffect } from "react";
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
        setError("Failed to fetch dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-4">Store Dashboard</h1>
        <p className="lead">Here's an overview of your store's inventory.</p>

        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {stats && (
          <div className="row g-4 mt-3">
            <div className="col-md-4 col-sm-6">
              <div className="card text-bg-primary shadow-sm h-100">
                <div className="card-body text-center">
                  <h1 className="display-5 fw-bold">{stats.totalProducts}</h1>
                  <p className="card-text fs-5">Total Unique Products</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card text-bg-warning shadow-sm h-100">
                <div className="card-body text-center">
                  <h1 className="display-5 fw-bold">{stats.lowStock}</h1>
                  <p className="card-text fs-5">Low Stock Batches</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card text-bg-secondary shadow-sm h-100">
                <div className="card-body text-center">
                  <h1 className="display-5 fw-bold">{stats.outOfStock}</h1>
                  <p className="card-text fs-5">Out of Stock Batches</p>
                </div>
              </div>
            </div>
             <div className="col-md-4 col-sm-6">
              <div className="card text-bg-danger shadow-sm h-100">
                <div className="card-body text-center">
                  <h1 className="display-5 fw-bold">{stats.expired}</h1>
                  <p className="card-text fs-5">Expired Batches</p>
                </div>
              </div>
            </div>
             <div className="col-md-4 col-sm-6">
              <div className="card text-bg-info shadow-sm h-100">
                <div className="card-body text-center">
                  <h1 className="display-5 fw-bold">{stats.expiringSoon}</h1>
                  <p className="card-text fs-5">Expiring Soon (30d)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;