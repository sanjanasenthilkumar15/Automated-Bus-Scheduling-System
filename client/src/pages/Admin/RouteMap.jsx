// src/pages/RouteMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const RouteMap = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("/api/routes");
        setRoutes(response.data);
        if (response.data.length > 0) {
          setSelectedRoute(response.data[0]); // Default to first
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const center = selectedRoute?.path?.[0] || { lat: 13.0827, lng: 80.2707 }; // Default Chennai

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Route Map Viewer</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Route:</label>
        <select
          className="border rounded px-3 py-1"
          onChange={(e) =>
            setSelectedRoute(routes.find((r) => r.route_id === e.target.value))
          }
          value={selectedRoute?.route_id || ""}
        >
          {routes.map((route) => (
            <option key={route.route_id} value={route.route_id}>
              {route.route_name}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[500px] w-full rounded shadow">
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {selectedRoute?.path && (
            <>
              <Polyline positions={selectedRoute.path.map(p => [p.lat, p.lng])} color="blue" />
              {selectedRoute.path.map((point, index) => (
                <Marker key={index} position={[point.lat, point.lng]}>
                  <Popup>Point {index + 1}</Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
