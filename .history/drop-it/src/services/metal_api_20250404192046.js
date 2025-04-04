import React, { useEffect, useState } from "react";

const API_KEY = "c852640c64bb657762474154f3cea9f6";
const BASE_URL = "https://api.metalpriceapi.com/v1/";
const API_URL = "https://api.metalpriceapi.com/v1/latest"

const [prices, setPrices] = useState([]);

useEffect(() => {
    async function fetchPrices() {
        try {
            const response = await fetch(`${API_URL}?api_key=${API_KEY}&base=INR`);
            const data = response.json();
        }
        
    }
}) 