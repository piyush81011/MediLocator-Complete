// import React, { useState, useEffect } from "react";
// import AdminSidebar from "../components/AdminSidebar";
// import api from "../utils/api";

// const BillListPage = () => {
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     const fetchBills = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get("/billing");
//         setBills(res.data.data.bills);
//       } catch (err) {
//         setError("Failed to fetch sales history.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBills();
//   }, []);

//   return (
//     <div className="d-flex vh-100">
//       <AdminSidebar />
//       <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
//         <h1 className="display-5">Sales History</h1>
//         <p className="lead">Here is a list of all completed sales.</p>

//         {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
//         {error && <p className="alert alert-danger">{error}</p>}
        
//         <div className="card shadow-sm mt-3">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>Date</th>
//                   <th>Customer Name</th>
//                   <th>Items</th>
//                   <th>Total Amount</th>
//                   <th>Payment</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bills.map((bill) => (
//                   <tr key={bill._id}>
//                     <td>{new Date(bill.createdAt).toLocaleString()}</td>
//                     <td>{bill.customerName}</td>
//                     <td>{bill.items.length}</td>
//                     <td>₹{bill.totalAmount.toFixed(2)}</td>
//                     <td><span className="badge text-bg-success">{bill.paymentMethod}</span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillListPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import api from "../utils/api";

const BillListPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalSales: 0,
    totalBills: 0,
    avgBillValue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bills, filter, searchTerm]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await api.get("/billing/history");
      setBills(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch sales history.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bills];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (filter === "today") {
      filtered = filtered.filter(bill => new Date(bill.createdAt) >= today);
    } else if (filter === "week") {
      filtered = filtered.filter(bill => new Date(bill.createdAt) >= weekAgo);
    } else if (filter === "month") {
      filtered = filtered.filter(bill => new Date(bill.createdAt) >= monthAgo);
    }

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerPhone?.includes(searchTerm)
      );
    }

    setFilteredBills(filtered);

    const total = filtered.reduce((sum, bill) => sum + bill.total, 0);
    setStats({
      totalSales: total,
      totalBills: filtered.length,
      avgBillValue: filtered.length > 0 ? total / filtered.length : 0,
    });
  };

  const printBill = (bill) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${bill.billNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #2c5f2d; }
          .bill-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .totals { margin-top: 20px; text-align: right; }
          .totals div { margin: 5px 0; }
          .total-amount { font-size: 1.3em; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #333; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 MediLocator Store</h1>
          <p>Medical & Healthcare Products</p>
        </div>
        
        <div class="bill-info">
          <div>
            <strong>Bill No:</strong> ${bill.billNumber}<br>
            <strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Customer:</strong> ${bill.customerName}<br>
            ${bill.customerPhone ? `<strong>Phone:</strong> ${bill.customerPhone}` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.product?.name || 'Product'}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div><strong>Subtotal:</strong> ₹${bill.subtotal.toFixed(2)}</div>
          ${bill.discount > 0 ? `<div><strong>Discount:</strong> - ₹${bill.discount.toFixed(2)}</div>` : ''}
          <div><strong>GST:</strong> ₹${bill.tax.toFixed(2)}</div>
          <div class="total-amount"><strong>Total Amount:</strong> ₹${bill.total.toFixed(2)}</div>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold">📊 Sales History</h1>
          <button className="btn btn-success" onClick={() => navigate("/store/billing/new")}>
            + New Bill
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Sales</h6>
                <h3 className="text-success mb-0">₹{stats.totalSales.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Bills</h6>
                <h3 className="text-primary mb-0">{stats.totalBills}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted mb-2">Avg Bill Value</h6>
                <h3 className="text-info mb-0">₹{stats.avgBillValue.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label fw-bold">Search Bills</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by bill number, customer name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Filter by Date</label>
                <div className="btn-group w-100" role="group">
                  <button
                    className={`btn ${filter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('all')}
                  >
                    All Time
                  </button>
                  <button
                    className={`btn ${filter === 'today' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('today')}
                  >
                    Today
                  </button>
                  <button
                    className={`btn ${filter === 'week' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('week')}
                  >
                    This Week
                  </button>
                  <button
                    className={`btn ${filter === 'month' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('month')}
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success"></div>
            <p className="mt-3">Loading bills...</p>
          </div>
        )}

        {!loading && filteredBills.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem" }}>📄</div>
            <h4>No bills found</h4>
            <p className="text-muted">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first bill to see it here'}
            </p>
          </div>
        )}

        {!loading && filteredBills.length > 0 && (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Bill No</th>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill._id}>
                      <td><strong>{bill.billNumber}</strong></td>
                      <td>
                        <small>{new Date(bill.createdAt).toLocaleDateString()}</small>
                        <br />
                        <small className="text-muted">{new Date(bill.createdAt).toLocaleTimeString()}</small>
                      </td>
                      <td>{bill.customerName || 'Walk-in'}</td>
                      <td>
                        {bill.customerPhone ? (
                          <a href={`tel:${bill.customerPhone}`}>{bill.customerPhone}</a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{bill.items?.length || 0} items</span>
                      </td>
                      <td>₹{bill.subtotal.toFixed(2)}</td>
                      <td>
                        {bill.discount > 0 ? (
                          <span className="text-danger">-₹{bill.discount.toFixed(2)}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <strong className="text-success">₹{bill.total.toFixed(2)}</strong>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => printBill(bill)}
                        >
                          🖨️ Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillListPage;