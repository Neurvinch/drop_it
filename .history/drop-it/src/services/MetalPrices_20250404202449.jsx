import { useEffect, useState } from "react";

function MetalPrices() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.metalpriceapi.com/v1/latest?api_key=c852640c64bb657762474154f3cea9f6&base=USD&currencies=EUR,XAU,XAG"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data && data.rates) {
          // ✅ Fix: Access 'rates' instead of 'metals'
          setPrices(Object.entries(data.rates)); // Convert rates object into an array
        } else {
          console.error("Unexpected data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2>Metal Prices</h2>
      {prices.length > 0 ? (
        <ul>
          {prices.map(([metal, price]) => (
            <li key={metal}>
              {metal}: {price} USD {/* ✅ Fix: Show correct unit */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading or no data available...</p>
      )}
    </div>
  );
}

export default MetalPrices;
