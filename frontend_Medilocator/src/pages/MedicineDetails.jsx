import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Public route, use raw axios

function MedicineDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded images (you can replace this later)
  const images = [
    "https://media.istockphoto.com/id/1022216070/photo/packet-of-generic-paracetamol-tablets.jpg?s=2048x2048&w=is&k=20&c=wG39Ddaqn2C_hgh7VjQ-_XpqpquEy-oitQpv0EGhfBY=",
    "https://media.istockphoto.com/id/157402355/photo/generic-paracetamol-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=hJmEMYYvJ8s4gTkdTewITUaRQg63Al6tJRDWHBizW6Y=",
    "https://media.istockphoto.com/id/1217213618/photo/generic-paracetamol-500mg-tablets.jpg?s=1024x1024&w=is&k=20&c=VrfcQ0v51-DOeM4iQpgzGizdAHLYVaFVoG8NxIdX5_A="
  ];
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/products/${productId}`);
        setProduct(res.data.data);
      } catch (err) {
        setError("Could not find product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]); 

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return null; 
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          {/* Left Side - Images */}
          <img src={mainImage} alt={product.name} className="img-fluid rounded border mb-3" />
          <div className="d-flex justify-content-start">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={`img-thumbnail me-2 ${mainImage === img ? "border-primary border-3" : ""}`}
                style={{ width: "80px", height: "80px", cursor: "pointer", objectFit: "cover" }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        
        <div className="col-md-6">
          {/* Right Side - Details (now dynamic) */}
          <h1 className="display-5">{product.name}</h1>
          <p className="lead text-muted">By {product.manufacturer || product.brand}</p>
          <p className="fs-5"><strong>Pack Size:</strong> {product.packSize}</p>
          <p className="fs-5"><strong>Generic Name:</strong> {product.genericName || "N/A"}</p>
          
          {product.description && (
            <>
              <h5 className="mt-4">Description</h5>
              <p>{product.description}</p>
            </>
          )}

          {product.requiresPrescription && (
            <p className="badge text-bg-warning fs-6">⚕️ Prescription Required</p>
          )}
          
          <hr className="my-4" />
          
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Find in Stores</h5>
              <p className="card-text">This product is part of our master catalog. Prices and availability are set by individual stores.</p>
              <button className="btn btn-primary" disabled>
                Find Nearby Stores
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetails;