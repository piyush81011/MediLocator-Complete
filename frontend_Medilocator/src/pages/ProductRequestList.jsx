import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "../components/AdminSidebar";

const ProductRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await api.get("/requests");
        setRequests(res.data.data.requests);
      } catch (err) {
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      approved: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: '✓' },
      rejected: { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: '✕' },
      pending: { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: '⏱' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span 
        className="badge"
        style={{ 
          ...style,
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}
      >
        <span className="me-1">{style.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f5f7fa' }}>
        <div className="container-fluid" style={{ maxWidth: '1400px' }}>
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="display-6 fw-bold mb-1">📋 My Product Requests</h1>
              <p className="text-muted mb-0">Track your product addition requests</p>
            </div>
            <button 
              className="btn btn-lg px-4" 
              onClick={() => navigate("/store/request-product")}
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              <span className="me-2">+</span>New Request
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center">
                <div className="me-3" style={{ fontSize: '1.5rem' }}>⚠️</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#667eea' }}></div>
              <p className="mt-3 text-muted">Loading requests...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && requests.length === 0 && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '5rem', opacity: 0.3 }}>📋</div>
                <h4 className="fw-bold mb-2">No Requests Yet</h4>
                <p className="text-muted mb-4">
                  You haven't submitted any product requests. Request products that aren't in our catalog.
                </p>
                <button 
                  className="btn btn-lg px-4" 
                  onClick={() => navigate("/store/request-product")}
                  style={{ 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  Submit First Request
                </button>
              </div>
            </div>
          )}

          {/* Requests Table */}
          {!loading && requests.length > 0 && (
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <tr>
                      <th className="border-0 py-3">Product Details</th>
                      <th className="border-0 py-3">Category</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Feedback</th>
                      <th className="border-0 py-3">Requested On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => (
                      <tr key={req._id} style={{ background: idx % 2 === 0 ? 'white' : '#f8f9ff' }}>
                        <td className="border-0 py-3">
                          <div>
                            <strong className="d-block mb-1" style={{ fontSize: '1.05rem' }}>
                              {req.productName}
                            </strong>
                            <small className="text-muted">
                              <strong>Brand:</strong> {req.brand}
                              {req.genericName && (
                                <>
                                  <span className="mx-2">|</span>
                                  <strong>Generic:</strong> {req.genericName}
                                </>
                              )}
                            </small>
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <span 
                            className="badge"
                            style={{ 
                              background: '#e0e7ff',
                              color: '#667eea',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {req.category}
                          </span>
                        </td>
                        <td className="border-0 py-3">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="border-0 py-3">
                          <div style={{ maxWidth: '300px' }}>
                            {req.adminNotes || req.rejectionReason ? (
                              <div 
                                className="p-2"
                                style={{ 
                                  background: req.status === 'rejected' ? '#fee2e2' : '#f0fdf4',
                                  borderRadius: '8px',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {req.adminNotes || req.rejectionReason}
                              </div>
                            ) : (
                              <span className="text-muted">No feedback yet</span>
                            )}
                          </div>
                        </td>
                        <td className="border-0 py-3">
                          <div>
                            {new Date(req.createdAt).toLocaleDateString()}
                          </div>
                          <small className="text-muted">
                            {new Date(req.createdAt).toLocaleTimeString()}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Card */}
          {!loading && requests.length > 0 && (
            <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '16px', background: '#f8f9ff' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-2">ℹ️ Request Status Guide</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <span className="me-2">⏱</span>
                      <div>
                        <strong>Pending:</strong>
                        <small className="d-block text-muted">Under review by admin team</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✓</span>
                      <div>
                        <strong>Approved:</strong>
                        <small className="d-block text-muted">Product added to catalog</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <span className="me-2">✕</span>
                      <div>
                        <strong>Rejected:</strong>
                        <small className="d-block text-muted">Request not approved</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductRequestList;