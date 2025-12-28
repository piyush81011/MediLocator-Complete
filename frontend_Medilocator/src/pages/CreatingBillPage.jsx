import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, X, ShoppingCart, User, Phone, Percent, CreditCard, Printer, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import api from "../utils/api";

const BillingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showBillSuccess, setShowBillSuccess] = useState(false);
  const [lastBillData, setLastBillData] = useState(null);
  const [storeName, setStoreName] = useState("Medical Store");
  const navigate = useNavigate();

  // Fetch store name from localStorage
  useEffect(() => {
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

  // Inventory search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api.get("/inventory/search", {
          params: { search: searchTerm },
        });
        setSearchResults(res.data?.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Cart operations
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

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxRate = 5;
  const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const billData = {
        customerName: customerName || "Walk-in Customer",
        customerPhone: customerPhone || "",
        paymentMethod: "cash",
        items: cart.map(item => ({
          inventoryId: item._id,
          quantity: item.quantity
        }))
      };

      const res = await api.post("/billing", billData);
      const createdBill = res.data?.data || res.data;

      setLastBillData(createdBill);
      setShowBillSuccess(true);

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

  // Helper functions
  const escapeHtml = (str) => {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const generateBillHTML = (bill) => {
    if (!bill) return "<div>No bill data</div>";

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
          <h2>🏥 ${escapeHtml(storeName)}</h2>
          <p style="color:#666;margin-top:4px;">Medical & Healthcare Products</p>
          <hr style="border:1px solid #eee;margin:15px 0;">
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

  const printBill = () => {
    if (!lastBillData) return alert("No bill to print");
    const html = generateBillHTML(lastBillData);
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return alert("Popup blocked. Allow popups for this site to print.");
    w.document.open();
    w.document.write(html + `<script>window.onload = function(){ window.print(); }</script>`);
    w.document.close();
  };

  const downloadBillAsPDF = () => {
    if (!lastBillData) return alert("No bill to download");
    const html = generateBillHTML(lastBillData);
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
      <div className="flex-grow-1" style={{ overflow: "auto", backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 24px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button 
                  onClick={() => navigate("/store/dashboard")}
                  style={{ padding: "8px", background: "transparent", border: "none", borderRadius: "8px" }}
                  className="hover-bg-light"
                >
                  <ArrowLeft size={20} style={{ color: "#64748b" }} />
                </button>
                <div>
                  <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>Point of Sale</h1>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Create new billing invoice</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", color: "#64748b" }}>Current Bill</div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>₹{total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {showBillSuccess && lastBillData && (
          <div style={{ maxWidth: "1400px", margin: "16px auto", padding: "0 24px" }}>
            <div style={{ backgroundColor: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: "12px", padding: "16px" }} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: "40px", height: "40px", backgroundColor: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg style={{ width: "24px", height: "24px", color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontWeight: "600", color: "#064e3b", margin: 0 }}>Bill Created Successfully!</h3>
                  <p style={{ fontSize: "14px", color: "#047857", margin: 0 }}>Invoice #{lastBillData._id} • Amount: ₹{(lastBillData.totalAmount ?? 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button onClick={printBill} className="btn btn-light border d-flex align-items-center gap-2" style={{ color: "#047857" }}>
                  <Printer size={16} />
                  Print
                </button>
                <button onClick={downloadBillAsPDF} className="btn d-flex align-items-center gap-2" style={{ backgroundColor: "#10b981", color: "white" }}>
                  <Download size={16} />
                  Download
                </button>
                <button onClick={resetBilling} className="btn btn-outline-secondary">
                  New Bill
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
          <div className="row g-4">
            {/* Left Section - Products & Cart */}
            <div className="col-lg-8">
              {/* Search Bar */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <div style={{ position: "relative" }}>
                    <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                    <input
                      type="text"
                      placeholder="Search products by name, brand, or generic name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control form-control-lg"
                      style={{ paddingLeft: "48px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div style={{ marginTop: "12px", maxHeight: "240px", overflowY: "auto" }}>
                      {searchResults.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => addToCart(item)}
                          style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", marginBottom: "8px", cursor: "pointer", border: "1px solid #e2e8f0" }}
                          className="hover-bg-emerald-50"
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 style={{ fontWeight: "600", margin: 0, color: "#0f172a" }}>{item.product.name}</h6>
                              <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
                                {item.product.brand} • Batch: {item.batchNumber || "N/A"}
                              </p>
                              <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Stock: {item.stockQuantity} units</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>₹{item.price.toFixed(2)}</div>
                              <button className="btn btn-sm btn-success mt-1">Add</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Items */}
              <div className="card shadow-sm border-0">
                <div className="card-header" style={{ background: "linear-gradient(to right, #10b981, #059669)", padding: "16px 24px" }}>
                  <div className="d-flex align-items-center gap-3">
                    <ShoppingCart size={24} style={{ color: "white" }} />
                    <h5 style={{ color: "white", fontWeight: "bold", margin: 0 }}>Cart Items</h5>
                    <span className="ms-auto badge bg-white text-success" style={{ fontSize: "14px", fontWeight: "600" }}>
                      {cart.length} items
                    </span>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="card-body" style={{ padding: "48px 24px", textAlign: "center" }}>
                    <ShoppingCart size={64} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
                    <h5 style={{ fontSize: "18px", fontWeight: "600", color: "#64748b", marginBottom: "8px" }}>Cart is Empty</h5>
                    <p style={{ color: "#94a3b8" }}>Search and add products to start billing</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: "#f8fafc" }}>
                        <tr>
                          <th style={{ width: "50px" }}>S.No</th>
                          <th>Product Name</th>
                          <th>Batch</th>
                          <th style={{ width: "100px" }}>Price</th>
                          <th style={{ width: "150px" }}>Quantity</th>
                          <th style={{ width: "120px" }}>Amount</th>
                          <th style={{ width: "80px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, index) => (
                          <tr key={item._id}>
                            <td>
                              <div style={{ width: "32px", height: "32px", backgroundColor: "#d1fae5", color: "#047857", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px" }}>
                                {index + 1}
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: "#0f172a" }}>{item.product.name}</strong>
                              <br />
                              <small style={{ color: "#64748b" }}>{item.product.brand}</small>
                            </td>
                            <td>
                              <small>{item.batchNumber || "N/A"}</small>
                            </td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  style={{ width: "35px", height: "35px", padding: 0 }}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center fw-bold"
                                  style={{ width: "70px", fontSize: "16px" }}
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                                  min="1"
                                />
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  style={{ width: "35px", height: "35px", padding: 0 }}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: "#0f172a" }}>₹{(item.price * item.quantity).toFixed(2)}</strong>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeFromCart(item._id)}
                                style={{ width: "36px", height: "36px", padding: 0 }}
                              >
                                <X size={16} />
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

            {/* Right Section - Checkout */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 position-sticky" style={{ top: "24px" }}>
                <div className="card-header" style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)", padding: "16px 24px" }}>
                  <h5 style={{ color: "white", fontWeight: "bold", margin: 0 }} className="d-flex align-items-center gap-2">
                    <CreditCard size={24} />
                    Checkout
                  </h5>
                </div>

                <div className="card-body p-4">
                  {/* Customer Details */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2" style={{ color: "#334155" }}>
                      <User size={16} />
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Walk-in Customer"
                      className="form-control"
                      style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: "8px" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2" style={{ color: "#334155" }}>
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Optional"
                      className="form-control"
                      style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: "8px" }}
                    />
                  </div>

                  <hr style={{ margin: "16px 0" }} />

                  {/* Bill Summary */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2" style={{ color: "#334155" }}>
                      <span>Subtotal</span>
                      <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold d-flex align-items-center gap-2" style={{ color: "#334155" }}>
                        <Percent size={16} />
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                        className="form-control"
                        style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: "8px" }}
                        min="0"
                        max="100"
                      />
                    </div>

                    {discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-danger">
                        <span>Discount ({discount}%)</span>
                        <span className="fw-semibold">-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-2" style={{ color: "#334155" }}>
                      <span>GST (5%)</span>
                      <span className="fw-semibold">₹{taxAmount.toFixed(2)}</span>
                    </div>

                    <hr style={{ margin: "12px 0" }} />

                    <div className="d-flex justify-content-between align-items-center pt-2">
                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>Total Amount</span>
                      <span style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981" }}>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-3" style={{ paddingTop: "16px" }}>
                    <button
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || loading}
                      className="btn btn-lg d-flex align-items-center justify-content-center gap-2"
                      style={{ 
                        background: cart.length === 0 || loading ? "#cbd5e1" : "linear-gradient(to right, #10b981, #059669)", 
                        color: "white", 
                        fontWeight: "bold",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: cart.length > 0 && !loading ? "0 4px 6px rgba(16, 185, 129, 0.3)" : "none"
                      }}
                    >
                      <CreditCard size={20} />
                      {loading ? "Processing..." : "Complete Payment"}
                    </button>

                    <button
                      onClick={() => {
                        setCart([]);
                        setCustomerName("");
                        setCustomerPhone("");
                        setDiscount(0);
                      }}
                      className="btn btn-lg"
                      style={{ 
                        backgroundColor: "#f1f5f9", 
                        color: "#334155", 
                        fontWeight: "600",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none"
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;