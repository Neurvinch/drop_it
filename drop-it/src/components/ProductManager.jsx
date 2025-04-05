// src/components/ProductManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    starting_price: '',
    image_urls: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.data);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image_urls: e.target.value.split(',') });
  };

  const createProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // From login
    const res = await axios.post('http://localhost:5000/api/products', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts([...products, res.data.data]);
    setFormData({
      name: '',
      description: '',
      category: '',
      condition: '',
      starting_price: '',
      image_urls: [],
    });
  };

  return (
    <div>
      <h2>Products</h2>
      {products.map(product => (
        <div key={product._id}>
          <p>{product.name} - ₹{product.current_price} by {product.seller_id.username}</p>
        </div>
      ))}
      <h3>Add Product</h3>
      <form onSubmit={createProduct}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
        <input name="condition" value={formData.condition} onChange={handleChange} placeholder="Condition" required />
        <input name="starting_price" type="number" value={formData.starting_price} onChange={handleChange} placeholder="Starting Price" required />
        <input name="image_urls" value={formData.image_urls.join(',')} onChange={handleImageChange} placeholder="Image URLs (comma-separated)" />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default ProductManager;