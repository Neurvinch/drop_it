// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
 

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, 
      
      );
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