import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../utils/api";

const BillListPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const res = await api.get("/billing");
        setBills(res.data.data.bills);
      } catch (err) {
        setError("Failed to fetch sales history.");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-5">Sales History</h1>
        <p className="lead">Here is a list of all completed sales.</p>

        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <p className="alert alert-danger">{error}</p>}
        
        <div className="card shadow-sm mt-3">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{new Date(bill.createdAt).toLocaleString()}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.items.length}</td>
                    <td>₹{bill.totalAmount.toFixed(2)}</td>
                    <td><span className="badge text-bg-success">{bill.paymentMethod}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillListPage;