import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const CreateBillPage = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const navigate = useNavigate();

  // 1. Debounced search for inventory
  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }
    setLoadingSearch(true);
    const delayDebounce = setTimeout(async () => {
      try {
        // Calls the NEW /api/v1/inventory/search endpoint
        const res = await api.get("/inventory/search", { params: { search } });
        setSearchResults(res.data.data);
      } catch (err) {
        setError("Failed to search inventory.");
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // 2. Add an item (a specific batch) to the cart
  const addToCart = (batch) => {
    const existingCartItem = cart.find(item => item.inventoryId === batch._id);
    
    if (existingCartItem) {
      if (existingCartItem.quantity < batch.stockQuantity) {
        setCart(cart.map(item => 
          item.inventoryId === batch._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      } else {
        alert("Max stock reached for this batch.");
      }
    } else {
      if (batch.stockQuantity > 0) {
        setCart([
          ...cart, 
          { 
            inventoryId: batch._id, 
            name: batch.product.name,
            batchNumber: batch.batchNumber,
            price: batch.price,
            stock: batch.stockQuantity,
            quantity: 1 
          }
        ]);
      }
    }
    setSearch("");
    setSearchResults([]);
  };

  // 3. Update quantity in cart
  const updateQuantity = (inventoryId, newQuantity) => {
    const itemInCart = cart.find(item => item.inventoryId === inventoryId);
    if (!itemInCart) return;
    
    const qty = parseInt(newQuantity) || 0;

    if (qty > 0 && qty <= itemInCart.stock) {
      setCart(cart.map(item => 
        item.inventoryId === inventoryId 
          ? { ...item, quantity: qty } 
          : item
      ));
    } else if (qty <= 0) {
      removeFromCart(inventoryId);
    } else {
      alert("Max stock reached for this batch.");
      setCart(cart.map(item => 
        item.inventoryId === inventoryId 
          ? { ...item, quantity: itemInCart.stock } 
          : item
      ));
    }
  };

  // 4. Remove from cart
  const removeFromCart = (inventoryId) => {
    setCart(cart.filter(item => item.inventoryId !== inventoryId));
  };

  // 5. Calculate total
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // 6. Submit the bill
  const handleSubmitBill = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Cannot create an empty bill.");
      return;
    }
    setLoadingSubmit(true);
    setError(null);
    try {
      await api.post("/billing", {
        items: cart.map(item => ({ 
          inventoryId: item.inventoryId, 
          quantity: item.quantity,
          name: item.name, 
          batchNumber: item.batchNumber
        })),
        customerName: customerName || "Walk-in",
        customerPhone: customerPhone
      });
      alert("Bill created successfully!");
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      navigate("/store/billing/history"); // Go to sales history
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 vh-100" style={{ overflow: 'auto', backgroundColor: '#f8f9fa' }}>
        <h1 className="display-5">New Bill / Point of Sale (POS)</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          
          {/* Left Side: Cart */}
          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Billing Cart</h5>
                {cart.length === 0 ? (
                  <p>Your cart is empty. Use the search to add products.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Batch</th>
                          <th style={{width: "120px"}}>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.inventoryId}>
                            <td>{item.name}</td>
                            <td><span className="badge text-bg-secondary">{item.batchNumber}</span></td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control form-control-sm"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.inventoryId, e.target.value)}
                                max={item.stock}
                                min={1}
                              />
                              <small className="text-muted">In stock: {item.stock}</small>
                            </td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.inventoryId)}>
                                X
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

          {/* Right Side: Search and Checkout */}
          <div className="col-lg-5">
            {/* Search Box */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="card-title">Search Products In My Inventory</h5>
                <input 
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Start typing to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {loadingSearch && <p>Searching...</p>}
                {searchResults.length > 0 && (
                  <div className="list-group mt-2" style={{maxHeight: "300px", overflowY: "auto"}}>
                    {searchResults.map(batch => (
                      <button 
                        key={batch._id} 
                        type="button"
                        className="list-group-item list-group-item-action"
                        onClick={() => addToCart(batch)}
                      >
                        <strong>{batch.product.name}</strong> ({batch.product.brand})<br/>
                        <small>
                          Batch: <span className="text-danger">{batch.batchNumber}</span> | 
                          Stock: <span className="text-danger">{batch.stockQuantity}</span> |
                          Price: ₹{batch.price.toFixed(2)} |
                          Expiry: {new Date(batch.expiryDate).toLocaleDateString()}
                        </small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Checkout Box */}
            <form onSubmit={handleSubmitBill}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Checkout</h5>
                  <div className="mb-2">
                    <label className="form-label">Customer Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Walk-in Customer"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Customer Phone</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Optional phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <hr/>
                  <h3 className="text-end">Total: ₹{totalAmount.toFixed(2)}</h3>
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg w-100" 
                    disabled={cart.length === 0 || loadingSubmit}
                  >
                    {loadingSubmit ? "Processing..." : "Create Bill (Cash)"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBillPage;