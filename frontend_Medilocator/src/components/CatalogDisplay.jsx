import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Use raw axios for public, no-auth requests
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onViewDetails }) => {
  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-muted">{product.brand}</p>
          <span className="badge text-bg-info align-self-start">{product.category}</span>
          {product.requiresPrescription && (
            <span className="badge text-bg-warning align-self-start mt-2">⚕️ Prescription Required</span>
          )}
          <button 
            className="btn btn-outline-primary mt-auto" 
            onClick={() => onViewDetails(product._id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const CatalogDisplay = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const categories = ['medicine', 'equipment', 'supplement', 'other'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the PUBLIC route /api/v1/products (from products.public.routes.js)
        const res = await axios.get('/api/v1/products', {
          params: {
            page: currentPage,
            limit: 20,
            category: category,
            search: searchTerm
          }
        });
        
        setProducts(res.data.data.products);
        setTotalPages(res.data.data.pagination.pages || 1);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, category, searchTerm]); 

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container my-5">
      <h1 className="display-4 text-center mb-4">Product Catalog</h1>
      
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        <div className="col-md-4">
          <select
            className="form-select form-select-lg"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center p-5"><h4>No products found.</h4></div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-5 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
                    Previous
                  </button>
                </li>
                <li className="page-item disabled"><span className="page-link">Page {currentPage} of {totalPages}</span></li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogDisplay;