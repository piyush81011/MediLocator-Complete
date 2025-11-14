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
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Search inventory
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
        setSearchResults(res.data.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

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
  const taxRate = 5; // 5% GST
  const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

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
        items: cart.map((item) => ({
          inventoryId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        total,
      };

      await api.post("/billing", billData);
      alert("Bill created successfully!");
      
      // Reset
      setCart([]);
      setCustomerName("Walk-in Customer");
      setCustomerPhone("");
      setDiscount(0);
      navigate("/store/billing/history");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f5f5", overflow: "auto" }}>
        
        <h2 className="mb-4">📋 Point of Sale (POS)</h2>

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
                              <div className="input-group input-group-sm">
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(item._id, parseInt(e.target.value) || 1)
                                  }
                                  min="1"
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
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

                {/* Bill Summary */}
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
                  disabled={loading || cart.length === 0}
                >
                  {loading ? "Processing..." : "💰 Create Bill (Cash)"}
                </button>

                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setCart([]);
                    setCustomerName("Walk-in Customer");
                    setCustomerPhone("");
                    setDiscount(0);
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
  );
};

export default BillingPage;