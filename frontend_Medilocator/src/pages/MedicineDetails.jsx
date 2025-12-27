import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function MedicineDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const res = await axios.get(`https://medilocator-complete.onrender.com/api/v1/products/${productId}`);
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
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#667eea' }}></div>
            <p className="mt-3 text-muted">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container py-5">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body text-center py-5">
              <div style={{ fontSize: '4rem', opacity: 0.3 }}>❌</div>
              <h4 className="fw-bold mb-2">Product Not Found</h4>
              <p className="text-muted mb-4">The product you're looking for doesn't exist</p>
              <button 
                className="btn btn-lg px-4" 
                onClick={() => navigate('/')}
                style={{ 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  color: 'white'
                }}
              >
                Browse Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container py-5">
        
        {/* Back Button */}
        <button 
          className="btn mb-4" 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'white',
            border: '2px solid #e0e7ff',
            color: '#667eea',
            borderRadius: '10px',
            padding: '8px 20px',
            fontWeight: '600'
          }}
        >
          ← Back
        </button>

        <div className="row g-4">
          {/* Left: Images */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="card-body p-4">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="img-fluid rounded mb-3" 
                  style={{ 
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
                <div className="d-flex gap-2">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`thumb-${index}`}
                      className={`img-thumbnail ${mainImage === img ? 'border-primary border-3' : ''}`}
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        cursor: "pointer", 
                        objectFit: "cover",
                        borderRadius: '10px',
                        border: mainImage === img ? '3px solid #667eea' : '2px solid #e0e7ff'
                      }}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Details */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                
                {/* Product Name & Brand */}
                <div className="mb-4">
                  <h1 className="display-5 fw-bold mb-2">{product.name}</h1>
                  <p className="lead text-muted mb-3">By {product.manufacturer || product.brand}</p>
                  
                  <div className="d-flex gap-2 flex-wrap">
                    <span 
                      className="badge" 
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {product.category}
                    </span>
                    {product.requiresPrescription && (
                      <span 
                        className="badge" 
                        style={{ 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        ⚕️ Prescription Required
                      </span>
                    )}
                  </div>
                </div>

                <hr className="my-4" />

                {/* Product Info */}
                <div className="mb-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-3" style={{ background: '#f8f9ff', borderRadius: '12px' }}>
                        <small className="text-muted d-block mb-1">Pack Size</small>
                        <strong>{product.packSize}</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3" style={{ background: '#f8f9ff', borderRadius: '12px' }}>
                        <small className="text-muted d-block mb-1">Generic Name</small>
                        <strong>{product.genericName || "N/A"}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Description</h5>
                    <p className="text-muted" style={{ lineHeight: '1.7' }}>{product.description}</p>
                  </div>
                )}

                <hr className="my-4" />
                
                {/* CTA Card */}
                <div 
                  className="p-4" 
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    color: 'white'
                  }}
                >
                  <h5 className="fw-bold mb-2">🏪 Find in Stores</h5>
                  <p className="mb-3 opacity-75" style={{ fontSize: '0.95rem' }}>
                    This product is part of our master catalog. Check with local stores for availability and pricing.
                  </p>
                  <button 
                    className="btn btn-lg w-100" 
                    disabled
                    style={{ 
                      background: 'rgba(255,255,255,0.2)',
                      border: '2px solid white',
                      color: 'white',
                      borderRadius: '10px',
                      fontWeight: '600'
                    }}
                  >
                    Find Nearby Stores (Coming Soon)
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetails;