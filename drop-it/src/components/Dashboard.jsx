// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Dashboard = () => {
  const [scraps, setScraps] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [products, setProducts] = useState([]);
  const [scrapForm, setScrapForm] = useState({ name: '', description: '', category: '', weight: '', price: '' });
  const [auctionForm, setAuctionForm] = useState({ title: '', description: '', category: '', starting_price: '', end_date: '' });
  const [productForm, setProductForm] = useState({ name: '', description: '', category: '', price: '', image_urls: '' });
  const [bidAmount, setBidAmount] = useState('');
  const token = localStorage.getItem('token');
  
  let user = null;
  let role = 'Unknown';
  try {
    if (token) {
      user = jwtDecode(token);
      role = Array.isArray(user.roles) ? user.roles[0] : user.roles || 'Unknown';
    }
  } catch (error) {
    console.error('Token decode error:', error);
  }

  console.log('Token:', token);
  console.log('Decoded User:', user);
  console.log('Extracted Role:', role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scrapRes, auctionRes, productRes] = await Promise.all([
          axios.get('http://localhost:5000/api/scraps', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/auctions', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setScraps(scrapRes.data.data || []);
        setAuctions(auctionRes.data.data || []);
        setProducts(productRes.data.data || []);
        console.log('Auctions:', auctionRes.data.data);
      } catch (error) {
        console.error('Fetch error:', error.response?.data || error.message);
        setScraps([]);
        setAuctions([]);
        setProducts([]);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleScrapChange = (e) => setScrapForm({ ...scrapForm, [e.target.name]: e.target.value });
  const handleAuctionChange = (e) => setAuctionForm({ ...auctionForm, [e.target.name]: e.target.value });
  const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const postScrap = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/scraps', scrapForm, { headers: { Authorization: `Bearer ${token}` } });
      setScraps([...scraps, res.data.data]);
      setScrapForm({ name: '', description: '', category: '', weight: '', price: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting scrap');
    }
  };

  const buyScrap = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/scraps/${id}/buy`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setScraps(scraps.map(s => s._id === id ? res.data.data : s));
    } catch (error) {
      alert(error.response?.data?.message || 'Error buying scrap');
    }
  };

  const postAuction = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auctions', auctionForm, { headers: { Authorization: `Bearer ${token}` } });
      setAuctions([...auctions, res.data.data]);
      setAuctionForm({ title: '', description: '', category: '', starting_price: '', end_date: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating auction');
    }
  };

  const placeBid = async (auctionId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auctions/${auctionId}/bid`, { amount: Number(bidAmount) }, { headers: { Authorization: `Bearer ${token}` } });
      setAuctions(auctions.map(a => a._id === auctionId ? res.data.data : a));
      setBidAmount('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing bid');
    }
  };

  const closeAuction = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auctions/${id}/close`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setAuctions(auctions.map(a => a._id === id ? res.data.data : a));
    } catch (error) {
      alert(error.response?.data?.message || 'Error closing auction');
    }
  };

  const postProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/products', {
        ...productForm,
        image_urls: productForm.image_urls.split(',').map(url => url.trim()),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setProducts([...products, res.data.data]);
      setProductForm({ name: '', description: '', category: '', price: '', image_urls: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting product');
    }
  };

  const buyProduct = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/products/${id}/buy`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.map(p => p._id === id ? res.data.data : p));
    } catch (error) {
      alert(error.response?.data?.message || 'Error buying product');
    }
  };

  if (!token) return <div>Please log in at /api/login (use curl or Postman)</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard ({role})</h1>
      <p>Logged in as: {user?.username || 'Unknown'}</p>
      <p>Role Debug: {role}</p>

      {['User'].includes(role) && (
        <>
          <h2>User: Post Scrap</h2>
          <form onSubmit={postScrap} style={{ marginBottom: '20px' }}>
            <input name="name" value={scrapForm.name} onChange={handleScrapChange} placeholder="Name" required style={{ display: 'block', margin: '5px 0' }} />
            <textarea name="description" value={scrapForm.description} onChange={handleScrapChange} placeholder="Description" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="category" value={scrapForm.category} onChange={handleScrapChange} placeholder="Category" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="weight" type="number" value={scrapForm.weight} onChange={handleScrapChange} placeholder="Weight (kg)" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="price" type="number" value={scrapForm.price} onChange={handleScrapChange} placeholder="Price" required style={{ display: 'block', margin: '5px 0' }} />
            <button type="submit">Post Scrap</button>
          </form>

          <h2>User: Recycled Products</h2>
          {products.length === 0 ? <p>No products available</p> : products.map(product => (
            <div key={product._id} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
              <p>{product.name} - ₹{product.price} by {product.seller_id?.username || 'Unknown'}</p>
              {product.image_urls[0] && <img src={product.image_urls[0]} alt={product.name} style={{ maxWidth: '100px' }} />}
              <button onClick={() => buyProduct(product._id)}>Buy</button>
            </div>
          ))}
        </>
      )}

      {['Vendor'].includes(role) && (
        <>
          <h2>Vendor: Available Scraps</h2>
          {scraps.length === 0 ? <p>No scraps available</p> : scraps.map(scrap => (
            <div key={scrap._id} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
              <p>{scrap.name} - {scrap.weight}kg - ₹{scrap.price} by {scrap.seller_id?.username || 'Unknown'}</p>
              <button onClick={() => buyScrap(scrap._id)}>Buy</button>
            </div>
          ))}

          <h2>Vendor: Create Auction</h2>
          <form onSubmit={postAuction} style={{ marginBottom: '20px' }}>
            <input name="title" value={auctionForm.title} onChange={handleAuctionChange} placeholder="Title" required style={{ display: 'block', margin: '5px 0' }} />
            <textarea name="description" value={auctionForm.description} onChange={handleAuctionChange} placeholder="Description" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="category" value={auctionForm.category} onChange={handleAuctionChange} placeholder="Category" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="starting_price" type="number" value={auctionForm.starting_price} onChange={handleAuctionChange} placeholder="Starting Price" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="end_date" type="date" value={auctionForm.end_date} onChange={handleAuctionChange} placeholder="End Date" required style={{ display: 'block', margin: '5px 0' }} />
            <button type="submit">Create Auction</button>
          </form>

          <h2>Vendor: Your Auctions</h2>
    {auctions.filter(a => a.vendor_id?.username === user?.username).length === 0 ? <p>No auctions</p> : auctions.filter(a => a.vendor_id?.username === user?.username).map(auction => (
      <div key={auction._id} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
        <p>{auction.title} - ₹{auction.current_price} - {auction.is_closed ? 'Closed' : 'Open'}</p>
        {!auction.is_closed && <button onClick={() => closeAuction(auction._id)}>Close Auction</button>}
      </div>
    ))}
        </>
      )}

      {['Industrialist'].includes(role) && (
        <>
         
          <h2>Industrialist: Active Auctions</h2>
    {auctions.length === 0 ? <p>No auctions available</p> : auctions.map(auction => (
      <div key={auction._id} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
        <p>{auction.title} - ₹{auction.current_price} (Ends: {new Date(auction.end_date).toLocaleDateString()})</p>
        <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Bid Amount" />
        <button onClick={() => placeBid(auction._id)}>Place Bid</button>
      </div>
    ))}

          <h2>Industrialist: Post Recycled Product</h2>
          <form onSubmit={postProduct} style={{ marginBottom: '20px' }}>
            <input name="name" value={productForm.name} onChange={handleProductChange} placeholder="Name" required style={{ display: 'block', margin: '5px 0' }} />
            <textarea name="description" value={productForm.description} onChange={handleProductChange} placeholder="Description" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="category" value={productForm.category} onChange={handleProductChange} placeholder="Category" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="price" type="number" value={productForm.price} onChange={handleProductChange} placeholder="Price" required style={{ display: 'block', margin: '5px 0' }} />
            <input name="image_urls" value={productForm.image_urls} onChange={handleProductChange} placeholder="Image URLs (comma-separated)" style={{ display: 'block', margin: '5px 0' }} />
            <button type="submit">Post Product</button>
          </form>
        </>
      )}

      {!['User', 'Vendor', 'Industrialist'].includes(role) && (
        <p>No specific dashboard content for role: {role}. Please check your token or login again.</p>
      )}
    </div>
  );
};

export default Dashboard;