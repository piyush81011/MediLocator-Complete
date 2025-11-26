// src/pages/BillingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/formStyles.css";
import api from "../utils/api";

const BillingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0); // UI only, not stored in DB (Option 1)
  const [loading, setLoading] = useState(false);
  const [showBillSuccess, setShowBillSuccess] = useState(false);
  const [lastBillData, setLastBillData] = useState(null);
  const navigate = useNavigate();

  // --- Inventory search ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api.get("https://medilocator-complete.onrender.com/inventory/search", {
          params: { search: searchTerm },
        });
        setSearchResults(res.data?.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // --- Cart operations ---
  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter((c) => c._id !== id));
    } else {
      setCart(cart.map((c) => (c._id === id ? { ...c, quantity: newQty } : c)));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c._id !== id));
  };

  // --- Calculations (UI only) ---
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxRate = 5; // 5% GST (UI only)
  const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

  // --- Checkout (main) ---
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // Build payload exactly as backend expects (Option 1)
      const billData = {
        customerName: customerName || "Walk-in Customer",
        customerPhone: customerPhone || "",
        paymentMethod: "cash",
        items: cart.map(item => ({
          inventoryId: item._id,
          quantity: item.quantity
        }))
      };

      // Call backend
      const res = await api.post("/billing", billData);

      // backend returns created bill in res.data.data (ApiResponse wrapper)
      const createdBill = res.data?.data || res.data;

      // store for printing / download
      setLastBillData(createdBill);
      setShowBillSuccess(true);

      // clear cart and keep customer's name (or set to Walk-in)
      setCart([]);
      setCustomerName("Walk-in Customer");
      setCustomerPhone("");
      setDiscount(0);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers for printing/downloading ---
  const generateBillHTML = (bill) => {
    if (!bill) return "<div>No bill data</div>";

    // bill.items is expected to have: name, batchNumber, quantity, soldPrice
    const itemsHtml = (bill.items || []).map(i => {
      const price = i.soldPrice ?? i.price ?? 0;
      const amount = (price * (i.quantity || 1)).toFixed(2);
      return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(i.name || "")}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(i.batchNumber || "N/A")}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${i.quantity || 0}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${Number(price).toFixed(2)}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${amount}</td>
        </tr>
      `;
    }).join("");

    const createdAt = bill.createdAt ? new Date(bill.createdAt).toLocaleString() : new Date().toLocaleString();
    const totalAmount = bill.totalAmount ?? bill.total ?? 0;

    return `
      <html>
      <head>
        <title>Bill - ${escapeHtml(bill._id || "invoice")}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 20px; color: #222; }
          .container { max-width: 800px; margin: 0 auto; }
          h2 { margin-bottom: 0; }
          .meta { margin-top: 6px; color: #555; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          .right { text-align: right; }
          .summary { margin-top: 18px; width: 100%; }
          .summary td { border: none; padding: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>MediLocator Store</h2>
          <div class="meta">
            <div>Bill ID: ${escapeHtml(bill._id || "")}</div>
            <div>Date: ${escapeHtml(createdAt)}</div>
            <div>Customer: ${escapeHtml(bill.customerName || "Walk-in")}</div>
            <div>Phone: ${escapeHtml(bill.customerPhone || "N/A")}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch</th>
                <th style="width:80px;">Qty</th>
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
              <td style="width:70%"></td>
              <td style="width:30%">
                <table style="width:100%;">
                  <tr>
                    <td>Subtotal:</td>
                    <td class="right">₹${Number(bill.totalAmount ?? 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Total:</strong></td>
                    <td class="right"><strong>₹${Number(totalAmount).toFixed(2)}</strong></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="margin-top:20px;">Thank you for shopping with us!</p>
        </div>
      </body>
      </html>
    `;
  };

  // simple html escape
  const escapeHtml = (str) => {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  // Print: open new window and trigger print
  const printBill = () => {
    if (!lastBillData) return alert("No bill to print");
    const html = generateBillHTML(lastBillData);
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return alert("Popup blocked. Allow popups for this site to print.");
    w.document.open();
    w.document.write(html + `<script>window.onload = function(){ window.print(); }</script>`);
    w.document.close();
  };

  // Download as HTML (user can save as PDF from browser). Later you can replace with server PDF.
  const downloadBillAsPDF = () => {
    if (!lastBillData) return alert("No bill to download");
    const html = generateBillHTML(lastBillData);
    // Create a blob of type text/html; user can save it and open/print
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill_${lastBillData._id || Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resetBilling = () => {
    setShowBillSuccess(false);
    setLastBillData(null);
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setDiscount(0);
    setLoading(false);
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f5f5", overflow: "auto" }}>
        
        <h2 className="mb-4 fw-bold">📋 Point of Sale (POS)</h2>

        {/* Success Card */}
        {showBillSuccess && lastBillData && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <h4 className="alert-heading">✅ Bill Created Successfully!</h4>
            <p>Bill ID: <strong>{lastBillData._id}</strong></p>
            <p>Total Amount: <strong>₹{Number(lastBillData.totalAmount ?? 0).toFixed(2)}</strong></p>
            <hr />
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" onClick={printBill}>🖨️ Print Bill</button>
              <button className="btn btn-info" onClick={downloadBillAsPDF}>📥 Download Bill</button>
              <button className="btn btn-success" onClick={() => navigate("/store/billing/history")}>View Sales History</button>
              <button className="btn btn-outline-secondary" onClick={resetBilling}>New Bill</button>
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* Left Side - Product Search & Cart */}
          <div className="col-lg-8">
            {/* Search Box */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-bold">Search Products in Inventory</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Type product name, brand, or generic name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="list-group mt-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {searchResults.map((item) => (
                      <button
                        key={item._id}
                        className="list-group-item list-group-item-action"
                        onClick={() => addToCart(item)}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{item.product.name}</strong> - {item.product.brand}
                            <br />
                            <small className="text-muted">
                              Stock: {item.stockQuantity} | Batch: {item.batchNumber || "N/A"}
                            </small>
                          </div>
                          <div className="text-end">
                            <strong className="text-success">₹{item.price}</strong>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Billing Cart Table */}
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">📦 Billing Cart</h5>
              </div>
              <div className="card-body p-0">
                {cart.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <h5>Cart is empty</h5>
                    <p>Search and add products to start billing</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "50px" }}>S.No</th>
                          <th>Product Name</th>
                          <th>Batch</th>
                          <th style={{ width: "100px" }}>Price</th>
                          <th style={{ width: "120px" }}>Qty</th>
                          <th style={{ width: "120px" }}>Amount</th>
                          <th style={{ width: "80px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{item.product.name}</strong>
                              <br />
                              <small className="text-muted">{item.product.brand}</small>
                            </td>
                            <td>
                              <small>{item.batchNumber || "N/A"}</small>
                            </td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  style={{ width: "35px", height: "35px" }}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center fw-bold"
                                  style={{ width: "70px", fontSize: "1.1rem" }}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(item._id, parseInt(e.target.value) || 1)
                                  }
                                  min="1"
                                />
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  style={{ width: "35px", height: "35px" }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeFromCart(item._id)}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Checkout */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">💳 Checkout</h5>
              </div>
              <div className="card-body">
                
                {/* Customer Details */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Walk-in Customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Customer Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Optional"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <hr />

                {/* Bill Summary (UI-only) */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>₹{subtotal.toFixed(2)}</strong>
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold">Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="d-flex justify-content-between mb-2 text-danger">
                    <span>Discount ({discount}%):</span>
                    <strong>− ₹{discountAmount.toFixed(2)}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>GST ({taxRate}%):</span>
                    <strong>₹{taxAmount.toFixed(2)}</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">Total Amount:</h5>
                    <h4 className="mb-0 text-success">₹{total.toFixed(2)}</h4>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0 || showBillSuccess}
                >
                  {loading ? "Processing..." : "💰 Create Bill (Cash)"}
                </button>

                {!showBillSuccess && (
                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => {
                      setCart([]);
                      setCustomerName("");
                      setCustomerPhone("");
                      setDiscount(0);
                    }}
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
