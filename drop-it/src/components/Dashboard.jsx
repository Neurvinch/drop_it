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
        setScraps([]); // Fallback to empty arrays
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
    <div className="bg-blue-200 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard ({role})</h1>
        <p className="text-gray-600">Logged in as: <span className="font-medium">{user?.username || 'Unknown'}</span></p>
        <p className="text-xs text-gray-400">Role Debug: {role}</p>
      </header>
  
      {['User'].includes(role) && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Post Scrap</h2>
            <form onSubmit={postScrap} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  name="name" 
                  value={scrapForm.name} 
                  onChange={handleScrapChange} 
                  placeholder="Enter scrap name" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={scrapForm.description} 
                  onChange={handleScrapChange} 
                  placeholder="Enter scrap description" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    name="category" 
                    value={scrapForm.category} 
                    onChange={handleScrapChange} 
                    placeholder="E.g., Metal, Plastic" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input 
                    name="weight" 
                    type="number" 
                    value={scrapForm.weight} 
                    onChange={handleScrapChange} 
                    placeholder="0.00" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number" 
                    value={scrapForm.price} 
                    onChange={handleScrapChange} 
                    placeholder="0.00" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Post Scrap
              </button>
            </form>
          </div>
  
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recycled Products</h2>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No products available at the moment</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition duration-200">
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {product.image_urls[0] ? (
                        <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">by {product.seller_id?.username || 'Unknown'}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-lg">₹{product.price}</span>
                        <button 
                          onClick={() => buyProduct(product._id)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-md text-sm transition duration-200"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
  
      {['Vendor'].includes(role) && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Scraps</h2>
            {scraps.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No scraps available at the moment</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scraps.map(scrap => (
                      <tr key={scrap._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{scrap.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{scrap.weight} kg</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{scrap.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{scrap.seller_id?.username || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => buyScrap(scrap._id)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-md text-sm transition duration-200"
                          >
                            Buy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
  
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Auction</h2>
            <form onSubmit={postAuction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  name="title" 
                  value={auctionForm.title} 
                  onChange={handleAuctionChange} 
                  placeholder="Enter auction title" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={auctionForm.description} 
                  onChange={handleAuctionChange} 
                  placeholder="Enter auction description" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    name="category" 
                    value={auctionForm.category} 
                    onChange={handleAuctionChange} 
                    placeholder="E.g., Metal, Plastic" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
                  <input 
                    name="starting_price" 
                    type="number" 
                    value={auctionForm.starting_price} 
                    onChange={handleAuctionChange} 
                    placeholder="0.00" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    name="end_date" 
                    type="date" 
                    value={auctionForm.end_date} 
                    onChange={handleAuctionChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Create Auction
              </button>
            </form>
          </div>
  
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Auctions</h2>
            {auctions.filter(a => a.vendor_id?.username === user?.username).length === 0 ? (
              <p className="text-gray-500 text-center py-6">You haven't created any auctions yet</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auctions.filter(a => a.vendor_id?.username === user?.username).map(auction => (
                      <tr key={auction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{auction.title}</td>
                        <td className="px-6 py-4">₹{auction.current_price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${auction.is_closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {auction.is_closed ? 'Closed' : 'Open'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {!auction.is_closed && (
                            <button 
                              onClick={() => closeAuction(auction._id)} 
                              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-4 rounded-md text-sm transition duration-200"
                            >
                              Close Auction
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
  
      {['Industrialist'].includes(role) && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Auctions</h2>
            {auctions.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No auctions available at the moment</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auctions.map(auction => (
                  <div key={auction._id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition duration-200">
                    <h3 className="font-medium text-lg mb-1">{auction.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Ends: {new Date(auction.end_date).toLocaleDateString()}</p>
                    <p className="font-bold text-lg mb-4">Current bid: ₹{auction.current_price}</p>
                    <div className="flex space-x-4">
                      <input 
                        type="number" 
                        value={bidAmount} 
                        onChange={(e) => setBidAmount(e.target.value)} 
                        placeholder="Your bid amount" 
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button 
                        onClick={() => placeBid(auction._id)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                      >
                        Place Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Post Recycled Product</h2>
            <form onSubmit={postProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  name="name" 
                  value={productForm.name} 
                  onChange={handleProductChange} 
                  placeholder="Enter product name" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={productForm.description} 
                  onChange={handleProductChange} 
                  placeholder="Enter product description" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    name="category" 
                    value={productForm.category} 
                    onChange={handleProductChange} 
                    placeholder="E.g., Furniture, Decor" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number" 
                    value={productForm.price} 
                    onChange={handleProductChange} 
                    placeholder="0.00" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
                <input 
                  name="image_urls" 
                  value={productForm.image_urls} 
                  onChange={handleProductChange} 
                  placeholder="http://example.com/image1.jpg, http://example.com/image2.jpg" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Post Product
              </button>
            </form>
          </div>
        </div>
      )}
  
      {!['User', 'Vendor', 'Industrialist'].includes(role) && (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <div className="py-8">
            <div className="mb-4 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Access Error</h3>
            <p className="text-gray-600 mb-4">No specific dashboard content for role: {role}</p>
            <p className="text-gray-500 text-sm">Please check your token or login again.</p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Dashboard;