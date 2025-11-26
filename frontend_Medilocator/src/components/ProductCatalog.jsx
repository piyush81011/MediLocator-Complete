
import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./ProductCatalog.css";

const ProductCatalog = () => {

  const [search, setSearch] = useState("");


  const products = [
    { id: 1, name: "Dolo 650mg Strip Of 15 Tablets", brand: "Cipla Ltd", price: 23.45, discount: 27 },
    { id: 2, name: "Paracetamol 500mg Strip Of 10 Tablets", brand: "Sun Pharma", price: 18.25, discount: 15 },
    { id: 3, name: "Azithromycin 500mg Tablets", brand: "Zydus Healthcare", price: 95.0, discount: 20 },
    { id: 4, name: "Amoxicillin 250mg Capsules", brand: "Dr. Reddy’s", price: 65.75, discount: 10 },
    { id: 5, name: "Metformin 500mg Tablets", brand: "Glenmark", price: 45.5, discount: 12 },
    { id: 6, name: "Pantoprazole 40mg Tablets", brand: "Intas", price: 55.3, discount: 18 },
    { id: 7, name: "Cetirizine 10mg Tablets", brand: "Lupin", price: 20.0, discount: 5 },
    { id: 8, name: "Ranitidine 150mg Tablets", brand: "Torrent Pharma", price: 28.9, discount: 10 },
    { id: 9, name: "Cefixime 200mg Tablets", brand: "Alkem", price: 115.5, discount: 25 },
    { id: 10, name: "Ibuprofen 400mg Tablets", brand: "Abbott", price: 30.0, discount: 8 },
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="catalog-container">
      <AdminSidebar />

      <div className="catalog-main">
        <div className="catalog-header">
          <h1>Product Catalog</h1>
          <div className="catalog-controls">
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-btn">+ Add New Product</button>
          </div>
        </div>

        <div className="catalog-grid">
          {filtered.map((product) => (
            <div className="catalog-card" key={product.id}>
              <h3>{product.name}</h3>
              <p className="brand">By {product.brand}</p>
              <p>
                <strong>₹{product.price.toFixed(2)}</strong>{" "}
                <span className="discount">{product.discount}% OFF</span>
              </p>
              <div className="card-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
