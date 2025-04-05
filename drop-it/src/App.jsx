<<<<<<< HEAD
import React from 'react';
import AwardsSection from './AwardsSection';
import './App.css';
const Page = () => {
  return (
    <div className="page-container">
      {/* Other content before the animation */}
      
      <AwardsSection />
      
      {/* Other content after the animation */}
    </div>
  );
};

export default Page;
=======
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



function App() {
  return (

      <Router>
        <div className="App">
          <Routes>
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
>>>>>>> fb78d128feae2d526fafc6f360c131fb47a11a97
