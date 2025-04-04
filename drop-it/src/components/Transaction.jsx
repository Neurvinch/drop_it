// src/components/Transaction.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await axios.get('http://localhost:5000/api/transactions/user_id_here'); // Replace user_id_here
      setTransactions(res.data);
    };
    fetchTransactions();
  }, []);

  const createTransaction = async () => {
    const res = await axios.post('http://localhost:5000/api/transactions', { auction_id: 'auction_id_here' });
    setTransactions([...transactions, res.data]);
  };

  return (
    <div>
      <h2>Transactions</h2>
      <button onClick={createTransaction}>Create Transaction</button>
      {transactions.map(t => (
        <div key={t._id}>
          <p>Product: {t.product_id.name} - ₹{t.sale_price} - Status: {t.payment_status}</p>
        </div>
      ))}
    </div>
  );
};

export default Transactions;