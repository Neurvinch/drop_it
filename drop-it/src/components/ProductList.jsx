// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    };
    fetchProducts();
  }, [token]);

  return (
    <div>
      <h2>Available Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - ${product.starting_price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;