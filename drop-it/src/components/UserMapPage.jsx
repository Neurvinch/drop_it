import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getDistance } from 'geolib';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function UserMapPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        fetchNearbyVendors(loc);
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  }, []);

  const fetchNearbyVendors = async (userLoc) => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/vendors');
      const all = res.data;

      const nearby = all.filter(v => {
        const dist = getDistance(
          { latitude: userLoc[0], longitude: userLoc[1] },
          { latitude: parseFloat(v.lat), longitude: parseFloat(v.lng) }
        );
        return dist <= 5000;
      });

      setVendors(nearby);
    } catch (err) {
      setError("Failed to fetch vendors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (vendor) => {
    if (!userLocation) return null;
    const dist = getDistance(
      { latitude: userLocation[0], longitude: userLocation[1] },
      { latitude: parseFloat(vendor.lat), longitude: parseFloat(vendor.lng) }
    );
    return (dist / 1000).toFixed(2); // km
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* Map Section */}
      <div className="w-full lg:w-2/3 h-1/2 lg:h-full relative">
        {loading && !userLocation ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading map...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
            <div className="text-center text-red-600 p-4">
              <p className="text-lg font-semibold">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : userLocation && (
          <MapContainer center={userLocation} zoom={15} className="h-full w-full z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={userLocation}>
              <Popup><strong>Your Location</strong></Popup>
            </Marker>

            {vendors.map((v) => (
              <Marker
                key={v._id}
                position={[v.lat, v.lng]}
                eventHandlers={{
                  click: () => setSelectedVendor(v),
                }}
              >
                <Popup>
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-sm text-gray-700">
                      {v.address && v.address !== "Not Available" ? v.address : "Address not available"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 p-6 overflow-y-auto bg-gray-50 border-l">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            Nearby Shops ({vendors.length})
          </h2>

          {loading && vendors.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for nearby shops...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No vendors within 5km</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <div 
                    key={vendor._id}
                    className={`p-3 border rounded-lg cursor-pointer transition hover:bg-blue-50 ${
                      selectedVendor?._id === vendor._id ? 'bg-blue-100 border-blue-300' : 'bg-white'
                    }`}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {calculateDistance(vendor)} km
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {vendor.address && vendor.address !== "Not Available"
                        ? vendor.address
                        : "Address not available"}
                    </p>
                  </div>
                ))}
              </div>

              {selectedVendor && (
                <div className="bg-gray-50 p-4 rounded-lg border mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedVendor.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> {selectedVendor.address && selectedVendor.address !== "Not Available"
                      ? selectedVendor.address
                      : "N/A"}</p>
                    <p><strong>Distance:</strong> {calculateDistance(selectedVendor)} km</p>
                    <p><strong>Coordinates:</strong> {selectedVendor.lat}, {selectedVendor.lng}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserMapPage;
