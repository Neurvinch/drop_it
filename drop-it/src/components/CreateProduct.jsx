import React, { useState } from 'react';
import axios from 'axios';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming JWT is stored here
      await axios.post(
        `${process.env.REACT_APP_API_URL}/products`,
        { name, description, starting_price: Number(startingPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product listed successfully');
    } catch (error) {
      console.error('Error listing product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>List a New Product</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="number"
        value={startingPrice}
        onChange={(e) => setStartingPrice(e.target.value)}
        placeholder="Starting Price"
        required
      />
      <button type="submit">List Product</button>
    </form>
  );
};

export default CreateProduct;