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
import { FaReceipt, FaPrint, FaEye, FaTimes, FaPlus, FaSearch, FaCalendarAlt, FaRupeeSign, FaShoppingCart, FaChartLine, FaDownload } from "react-icons/fa";

const BillListPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [storeName, setStoreName] = useState("Medical Store");
  const [stats, setStats] = useState({
    totalSales: 0,
    totalBills: 0,
    avgBillValue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
    // Fetch store name from localStorage
    const store = localStorage.getItem("store");
    if (store) {
      try {
        const storeData = JSON.parse(store);
        setStoreName(storeData.storeName || storeData.name || "Medical Store");
      } catch {
        setStoreName("Medical Store");
      }
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bills, filter, searchTerm, startDate, endDate]);

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
    } else if (filter === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include entire end day
      filtered = filtered.filter(bill => {
        const billDate = new Date(bill.createdAt);
        return billDate >= start && billDate <= end;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerPhone?.includes(searchTerm)
      );
    }

    setFilteredBills(filtered);

    const total = filtered.reduce((sum, bill) => sum + (bill.total || bill.totalAmount || 0), 0);
    setStats({
      totalSales: total,
      totalBills: filtered.length,
      avgBillValue: filtered.length > 0 ? total / filtered.length : 0,
    });
  };

  // Helper to escape HTML
  const escapeHtml = (str) => {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Generate bill HTML matching POS format
  const generateBillHTML = (bill) => {
    if (!bill) return "<div>No bill data</div>";

    const itemsHtml = (bill.items || []).map(item => {
      const price = item.soldPrice ?? item.price ?? 0;
      const amount = (price * (item.quantity || 1)).toFixed(2);
      const name = item.product?.name || item.name || "Product";
      const batch = item.batchNumber || item.product?.batchNumber || "N/A";
      return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(name)}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(batch)}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity || 0}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${Number(price).toFixed(2)}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${amount}</td>
        </tr>
      `;
    }).join("");

    const createdAt = bill.createdAt ? new Date(bill.createdAt).toLocaleString() : new Date().toLocaleString();
    const subtotalAmount = bill.subtotal ?? bill.totalAmount ?? 0;
    const discountAmount = bill.discount ?? 0;
    const taxAmount = bill.tax ?? 0;
    const totalAmount = bill.total ?? bill.totalAmount ?? 0;

    return `
      <html>
      <head>
        <title>Bill - ${escapeHtml(bill.billNumber || bill._id)}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 20px; color: #222; }
          .container { max-width: 800px; margin: 0 auto; }
          h2 { margin-bottom: 0; color: #10b981; }
          .meta { margin-top: 6px; color: #555; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          .right { text-align: right; }
          .summary { margin-top: 18px; width: 100%; }
          .summary td { border: none; padding: 6px; }
          .total-row { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🏥 ${escapeHtml(storeName)}</h2>
          <p style="color:#666;margin-top:4px;">Medical & Healthcare Products</p>
          <hr style="border:1px solid #eee;margin:15px 0;">
          <div class="meta">
            <div><strong>Bill No:</strong> ${escapeHtml(bill.billNumber || bill._id)}</div>
            <div><strong>Date:</strong> ${escapeHtml(createdAt)}</div>
            <div><strong>Customer:</strong> ${escapeHtml(bill.customerName || "Walk-in")}</div>
            <div><strong>Phone:</strong> ${escapeHtml(bill.customerPhone || "N/A")}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch</th>
                <th style="width:80px;text-align:center;">Qty</th>
                <th style="width:120px;" class="right">Price</th>
                <th style="width:120px;" class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <table class="summary" style="margin-top: 16px;">
            <tr>
              <td style="width:60%"></td>
              <td style="width:40%">
                <table style="width:100%;">
                  <tr>
                    <td>Subtotal:</td>
                    <td class="right">₹${Number(subtotalAmount).toFixed(2)}</td>
                  </tr>
                  ${discountAmount > 0 ? `
                  <tr style="color:#dc3545;">
                    <td>Discount:</td>
                    <td class="right">- ₹${Number(discountAmount).toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td>Tax (GST):</td>
                    <td class="right">₹${Number(taxAmount).toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td style="padding-top:10px;"><strong>Total:</strong></td>
                    <td class="right" style="padding-top:10px;color:#10b981;"><strong>₹${Number(totalAmount).toFixed(2)}</strong></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="margin-top:30px;text-align:center;color:#666;">Thank you for shopping with us! 🙏</p>
        </div>
      </body>
      </html>
    `;
  };

  const printBill = (bill) => {
    const html = generateBillHTML(bill);
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert("Popup blocked. Please allow popups to print.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html + `<script>window.onload = function() { window.print(); }</script>`);
    printWindow.document.close();
  };

  const downloadBill = (bill) => {
    const html = generateBillHTML(bill);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill_${bill.billNumber || bill._id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Bill Detail Modal
  const BillModal = ({ bill, onClose }) => (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-4 shadow-lg"
        style={{ width: "95%", maxWidth: "550px", maxHeight: "90vh", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-success text-white p-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold"><FaReceipt className="me-2" />Bill #{bill.billNumber}</h5>
            <small>{new Date(bill.createdAt).toLocaleString()}</small>
          </div>
          <button className="btn btn-light btn-sm rounded-circle" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {/* Customer Info */}
        <div className="p-3 bg-light border-bottom">
          <div className="row">
            <div className="col-6">
              <small className="text-muted">Customer</small>
              <p className="mb-0 fw-bold">{bill.customerName || "Walk-in"}</p>
            </div>
            <div className="col-6 text-end">
              <small className="text-muted">Phone</small>
              <p className="mb-0 fw-bold">{bill.customerPhone || "-"}</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table className="table table-sm mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Item</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Price</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="fw-medium">{item.product?.name || "Product"}</span>
                    <br />
                    <small className="text-muted">{item.product?.brand}</small>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">₹{item.price?.toFixed(2)}</td>
                  <td className="text-end fw-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex justify-content-between mb-1">
            <span>Subtotal</span>
            <span>₹{bill.subtotal?.toFixed(2)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="d-flex justify-content-between mb-1 text-danger">
              <span>Discount</span>
              <span>- ₹{bill.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-2">
            <span>Tax (GST)</span>
            <span>₹{bill.tax?.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between fs-5 fw-bold text-success">
            <span>Total</span>
            <span>₹{bill.total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 border-top d-flex gap-2">
          <button className="btn btn-outline-secondary flex-grow-1" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-outline-success" onClick={() => downloadBill(bill)} title="Download">
            <FaDownload />
          </button>
          <button className="btn btn-success flex-grow-1" onClick={() => { printBill(bill); onClose(); }}>
            <FaPrint className="me-1" /> Print
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-3 p-md-4" style={{ overflow: "auto", backgroundColor: "#f0f2f5" }}>
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div>
            <h4 className="fw-bold mb-1"><FaChartLine className="me-2 text-success" />Sales History</h4>
            <p className="text-muted mb-0 d-none d-md-block">Track all your sales and transactions</p>
          </div>
          <button className="btn btn-success mt-2 mt-md-0" onClick={() => navigate("/store/billing/new")}>
            <FaPlus className="me-1" /> New Bill
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
              <div className="card-body p-3 text-center">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "40px", height: "40px" }}>
                  <FaRupeeSign className="text-success" />
                </div>
                <h5 className="fw-bold text-success mb-0">₹{stats.totalSales.toFixed(0)}</h5>
                <small className="text-muted">Total Sales</small>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
              <div className="card-body p-3 text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "40px", height: "40px" }}>
                  <FaReceipt className="text-primary" />
                </div>
                <h5 className="fw-bold text-primary mb-0">{stats.totalBills}</h5>
                <small className="text-muted">Total Bills</small>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
              <div className="card-body p-3 text-center">
                <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "40px", height: "40px" }}>
                  <FaShoppingCart className="text-info" />
                </div>
                <h5 className="fw-bold text-info mb-0">₹{stats.avgBillValue.toFixed(0)}</h5>
                <small className="text-muted">Avg Value</small>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <div className="btn-group" role="group">
                    {[
                      { key: "all", label: "All" },
                      { key: "today", label: "Today" },
                      { key: "week", label: "Week" },
                      { key: "month", label: "Month" },
                      { key: "custom", label: "Custom" }
                    ].map(f => (
                      <button
                        key={f.key}
                        className={`btn btn-sm ${filter === f.key ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  {filter === "custom" && (
                    <div className="d-flex gap-1 align-items-center">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        style={{ width: "130px" }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <span className="text-muted">-</span>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        style={{ width: "130px" }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success"></div>
            <p className="mt-2 text-muted">Loading bills...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBills.length === 0 && (
          <div className="text-center py-5">
            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
              <FaReceipt size={30} className="text-muted" />
            </div>
            <h5>No bills found</h5>
            <p className="text-muted">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'Create your first bill to see it here'}
            </p>
          </div>
        )}

        {/* Bills List - Desktop Table */}
        {!loading && filteredBills.length > 0 && (
          <>
            <div className="d-none d-md-block">
              <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBills.map((bill) => (
                        <tr key={bill._id}>
                          <td><strong className="text-primary">{bill.billNumber}</strong></td>
                          <td>
                            <small>{new Date(bill.createdAt).toLocaleDateString()}</small>
                            <br />
                            <small className="text-muted">{new Date(bill.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                          </td>
                          <td>
                            {bill.customerName || 'Walk-in'}
                            {bill.customerPhone && <><br /><small className="text-muted">{bill.customerPhone}</small></>}
                          </td>
                          <td><span className="badge bg-secondary">{bill.items?.length || 0}</span></td>
                          <td>
                            {bill.discount > 0 ? (
                              <span className="text-danger">-₹{bill.discount.toFixed(0)}</span>
                            ) : '-'}
                          </td>
                          <td><strong className="text-success">₹{bill.total.toFixed(2)}</strong></td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setSelectedBill(bill)}>
                              <FaEye />
                            </button>
                            <button className="btn btn-sm btn-outline-success" onClick={() => printBill(bill)}>
                              <FaPrint />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bills List - Mobile Cards */}
            <div className="d-md-none">
              {filteredBills.map((bill) => (
                <div key={bill._id} className="card border-0 shadow-sm mb-2" style={{ borderRadius: "12px" }} onClick={() => setSelectedBill(bill)}>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-primary mb-1">{bill.billNumber}</span>
                        <p className="mb-0 fw-bold">{bill.customerName || "Walk-in"}</p>
                      </div>
                      <div className="text-end">
                        <h5 className="text-success mb-0">₹{bill.total.toFixed(0)}</h5>
                        <small className="text-muted">{bill.items?.length} items</small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {new Date(bill.createdAt).toLocaleDateString()} • {new Date(bill.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </small>
                      <span className="text-primary small">Tap to view →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bill Detail Modal */}
        {selectedBill && <BillModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}
      </div>
    </div>
  );
};

export default BillListPage;