// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import AuctionList from './components/AuctionList';
import BidForm from './components/BidForm';
import NotificationPanel from './components/NotificationPanel';
import ProductManager from './components/ProductManager';
import './App.css';
import Home from './Home';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
            <Route path="/auctions" element={<PrivateRoute><AuctionList /></PrivateRoute>} />
            <Route path="/bid/:auctionId" element={<PrivateRoute><BidForm /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationPanel /></PrivateRoute>} />
            <Route path='/create-Product' element={<ProductManager/>}   />
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
