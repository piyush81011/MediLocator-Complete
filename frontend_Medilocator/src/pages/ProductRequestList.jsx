import React, { useState, useEffect } from "react";
import api from "../utils/api";
import AdminSidebar from "../components/AdminSidebar";

const ProductRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://medilocator-complete.onrender.com/api/v1/requests");
        setRequests(res.data.data.requests);
      } catch (err) {
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-6  fw-bold">My Product Requests</h1>
        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <p className="alert alert-danger">{error}</p>}
        <div className="card shadow-sm mt-3">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Status</th>
                <th>Admin Notes</th>
                <th>Date Requested</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.productName}</td>
                  <td>{req.brand}</td>
                  <td>
                    <span className={`badge ${req.status === 'approved' ? 'text-bg-success' : req.status === 'rejected' ? 'text-bg-danger' : 'text-bg-warning'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{req.adminNotes || req.rejectionReason || 'N/A'}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductRequestList;