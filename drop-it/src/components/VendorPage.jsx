import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function VendorPage() {
  const [shopName, setShopName] = useState('');
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        await fetchAddress(coords);
      },
      () => alert("Location access denied")
    );
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      return response.data.display_name;
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return "Not Available";
    }
  };

  const fetchAddress = async ([lat, lng]) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'json',
          lat,
          lon: lng
        }
      });
      setAddress(res.data.display_name || "Unknown address");
    } catch (err) {
      console.error("Failed to fetch address:", err);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];
        setPosition(coords);
        fetchAddress(coords);
      }
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopName || !position) return alert("Please enter all details");
    await axios.post('http://localhost:5000/api/vendors', {
      name: shopName,
      lat: position[0],
      lng: position[1],
      address,
    });
    alert("Shop location submitted!");
    setShopName('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Vendor Location Submission
        </h2>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <input
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-white border-2 border-blue-500 rounded p-3 text-gray-800 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          
          {position && (
            <div className="mb-4 p-4 border-2 border-blue-300 rounded bg-blue-50">
              <p className="mb-2"><span className="font-bold text-blue-800">Latitude:</span> {position[0]}</p>
              <p className="mb-2"><span className="font-bold text-blue-800">Longitude:</span> {position[1]}</p>
              <p className="mb-2"><span className="font-bold text-blue-800">Address:</span> {address}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            Submit Location
          </button>
        </form>
        
        {position && (
          <div className="border-4 border-blue-500 rounded overflow-hidden shadow-lg">
            <MapContainer 
              center={position} 
              zoom={15} 
              style={{ height: '500px' }}
              className="z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler />
              <Marker position={position} />
            </MapContainer>
          </div>
        )}
        
        <div className="mt-6 text-sm text-blue-700">
          <p>Click anywhere on the map to update location</p>
        </div>
      </div>
    </div>
  );
}

export default VendorPage;