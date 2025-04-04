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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Metal Prices</h1>
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metal</TableHead>
                  <TableHead>Price (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(prices).map(([metal, price]) => (
                  <TableRow key={metal}>
                    <TableCell>{metal}</TableCell>
                    <TableCell>{price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
