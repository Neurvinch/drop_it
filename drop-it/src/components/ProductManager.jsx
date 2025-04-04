
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // For decoding JWT to get user info

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    starting_price: '',
    image_urls: '',
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const token = localStorage.getItem('token');
  const user = token

  // Fetch unsold products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', );
        setProducts(res.data.data || []); // Fallback to empty array if no data
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch recommendations when a product is selected
  useEffect(() => {
    if (!selectedProductId) return;

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${selectedProductId}/recommendations`, );
        setRecommendations(res.data || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    fetchRecommendations();
  }, [selectedProductId]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create a new product
  const createProduct = async (e) => {
    e.preventDefault();
    if (!token) return alert('Please log in to create a product');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/products',
        {
          ...formData,
          image_urls: formData.image_urls.split(',').map(url => url.trim()), // Convert comma-separated string to array
        }
     
      );
      setProducts([...products, res.data.data]);
      setFormData({
        name: '',
        description: '',
        category: '',
        condition: '',
        starting_price: '',
        image_urls: '',
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating product');
    }
  };

  // Show recommendations for a product
  const showRecommendations = (productId) => {
    setSelectedProductId(productId === selectedProductId ? null : productId); // Toggle selection
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Create Product Form */}
      {user ? (
        <>
          <h2>Create Product</h2>
          <form onSubmit={createProduct} style={{ marginBottom: '20px' }}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              style={{ display: 'block', margin: '5px 0' }}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              style={{ display: 'block', margin: '5px 0' }}
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              required
              style={{ display: 'block', margin: '5px 0' }}
            />
            <input
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="Condition"
              required
              style={{ display: 'block', margin: '5px 0' }}
            />
            <input
              name="starting_price"
              type="number"
              value={formData.starting_price}
              onChange={handleChange}
              placeholder="Starting Price"
              required
              style={{ display: 'block', margin: '5px 0' }}
            />
            <input
              name="image_urls"
              value={formData.image_urls}
              onChange={handleChange}
              placeholder="Image URLs (comma-separated)"
              style={{ display: 'block', margin: '5px 0' }}
            />
            <button type="submit" style={{ marginTop: '10px' }}>Create Product</button>
          </form>
        </>
      ) : (
        <p>Please log in to create a product.</p>
      )}

      {/* List Unsold Products */}
      <h2>Unsold Products</h2>
      {products.length === 0 ? (
        <p>No unsold products found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map(product => (
            <li key={product._id} style={{ margin: '10px 0', borderBottom: '1px solid #ccc' }}>
              <p>
                <strong>{product.name}</strong> - ₹{product.current_price} by {product.seller_id.username}
              </p>
              <p>{product.description}</p>
              <p>Category: {product.category} | Condition: {product.condition}</p>
              {product.image_urls.length > 0 && (
                <img src={product.image_urls[0]} alt={product.name} style={{ maxWidth: '100px' }} />
              )}
              <button
                onClick={() => showRecommendations(product._id)}
                style={{ marginTop: '5px' }}
              >
                {selectedProductId === product._id ? 'Hide Recommendations' : 'Show Recommendations'}
              </button>

              {/* Recommendations */}
              {selectedProductId === product._id && (
                <div style={{ marginTop: '10px' }}>
                  <h3>Recommended Products</h3>
                  {recommendations.length === 0 ? (
                    <p>No recommendations available.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {recommendations.map(rec => (
                        <li key={rec._id}>
                          <p>{rec.name} - ₹{rec.current_price}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductManager;