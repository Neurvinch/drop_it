// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import AuctionList from './components/AuctionList';
import BidForm from './components/BidForm';
import NotificationPanel from './components/NotificationPanel';
import ProductManager from './components/ProductManager';
import './App.css';
import Home from './Home';



function App() {
  return (

      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="/bid/:auctionId" element={<BidForm />} />
            <Route path="/notifications" element={<NotificationPanel />} />
            <Route path='/create-Product' element={<ProductManager/>}   />
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </div>
      </Router>
  
  );
}

export default App;
