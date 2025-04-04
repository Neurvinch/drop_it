import React, { useEffect, useState } from "react";

const API_KEY = "c852640c64bb657762474154f3cea9f6";
const BASE_URL = "https://api.metalpriceapi.com/v1/";
const API_URL = "https://api.metalpriceapi.com/v1/latest";

export default function MetalPrices() {
  const [prices, setPrices] = useState(null);
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&base=INR`);
        const data = response.json();
        if (data.success) {
          setPrices(data.rates);
        } else {
          throw new Error(data.error.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  return (
    <div>
      <h1>{data}</h1>
    </div>
  );
}
