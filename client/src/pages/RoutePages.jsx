import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../components/layout/DashboardLayout';
import { EmptyState } from '../components/ui/SharedComponents';

const DEPOT_SIDEBAR = [
  { to: '/dashboard/depotManager', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  { to: '/depot/buses', icon: 'bi-bus-front-fill', label: 'Buses' },
  { to: '/depot/crews', icon: 'bi-person-badge-fill', label: 'Crews' },
  { to: '/depot/routes', icon: 'bi-signpost-split-fill', label: 'Routes', end: true },
  { to: '/dashboard/scheduler', icon: 'bi-calendar3', label: 'Scheduler' },
];

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/routes');
        const routeList = res.data || [];
        const enrichedRoutes = await Promise.all(routeList.map(async (route) => {
          const startEnd = getStartEndForRoute(route.routeNumber);
          const path = await fetchRouteFromORS(startEnd.start, startEnd.end);
          return { ...route, path };
        }));
        setRoutes(enrichedRoutes);
        if (enrichedRoutes.length > 0) setSelectedRoute(enrichedRoutes[0].routeNumber);
      } catch (err) { console.error('Error fetching enriched routes:', err); }
      finally { setLoading(false); }
    };
    fetchAllRoutes();
  }, []);

  const fetchRouteFromORS = async (start, end) => {
    const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJjNjljMzU3NTRhNTRjZmRiNjA1ZTdlZTRmYmRmNGZkIiwiaCI6Im11cm11cjY0In0=';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
    try {
      const response = await axios.get(url);
      const coords = response.data.features[0].geometry.coordinates;
      return coords.map(coord => [coord[1], coord[0]]);
    } catch (error) { console.error('Error fetching route from ORS:', error); return []; }
  };

  const getStartEndForRoute = (routeNumber) => {
    switch (routeNumber) {
      case '15G': return { start: { lat: 13.0935, lng: 80.278 }, end: { lat: 12.8997, lng: 80.2278 } };
      case '27D': return { start: { lat: 13.0475, lng: 80.2126 }, end: { lat: 12.9896, lng: 80.2512 } };
      case '570': return { start: { lat: 13.0708, lng: 80.2129 }, end: { lat: 12.8312, lng: 80.2276 } };
      case '29C': return { start: { lat: 13.0863, lng: 80.2874 }, end: { lat: 12.9981, lng: 80.2646 } };
      case '102A': return { start: { lat: 13.0377, lng: 80.2348 }, end: { lat: 12.9251, lng: 80.1172 } };
      default: return { start: { lat: 13.05, lng: 80.25 }, end: { lat: 13.0, lng: 80.2 } };
    }
  };

  const selected = routes.find(r => r.routeNumber === selectedRoute);
  const midpoint = selected?.path?.length ? selected.path[Math.floor(selected.path.length / 2)] : [13.05, 80.25];

  useEffect(() => {
    if (selected?.path?.length > 0 && mapRef.current) {
      mapRef.current.fitBounds(selected.path);
    }
  }, [selected]);

  return (
    <DashboardLayout title="Route Management" subtitle={`${routes.length} routes`} sidebarLinks={DEPOT_SIDEBAR}>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 50, borderRadius: 'var(--radius-md)' }}></div>
          {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card"></div>)}
        </div>
      ) : (
        <>
          {/* Route Cards */}
          <div className="route-grid" style={{ marginBottom: 24 }}>
            {routes.map(route => (
              <div key={route.routeNumber}
                className="route-card"
                style={{
                  borderColor: selectedRoute === route.routeNumber ? 'var(--primary)' : undefined,
                  boxShadow: selectedRoute === route.routeNumber ? '0 0 0 2px var(--primary-glow)' : undefined
                }}
                onClick={() => setSelectedRoute(route.routeNumber)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="route-number">{route.routeNumber}</div>
                  {selectedRoute === route.routeNumber && (
                    <span className="badge-status badge-active">Selected</span>
                  )}
                </div>
                <div className="route-desc">{route.description}</div>
                <div className="route-meta">
                  <div className="route-meta-item">
                    <i className="bi bi-clock"></i>
                    <span>{route.roundTripTime} min round trip</span>
                  </div>
                  <div className="route-meta-item">
                    <i className="bi bi-arrow-repeat"></i>
                    <span>Every {route.frequency} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          {selected && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header-custom">
                <h3><i className="bi bi-map" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Route Map — {selected.routeNumber}</h3>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{selected.description}</span>
              </div>
              <div style={{ height: 400 }}>
                <MapContainer
                  center={midpoint} zoom={12}
                  style={{ height: '100%', width: '100%', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}
                  whenCreated={(mapInstance) => (mapRef.current = mapInstance)}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {selected?.path?.length > 0 && (
                    <>
                      <Polyline positions={selected.path} color="#1a4fd6" weight={4} opacity={0.8} />
                      <Marker position={selected.path[0]}><Popup>Start: {selected.routeNumber}</Popup></Marker>
                      <Marker position={selected.path[selected.path.length - 1]}><Popup>End: {selected.routeNumber}</Popup></Marker>
                      <Marker position={midpoint}>
                        <Popup>
                          <strong>{selected.routeNumber}</strong><br />
                          {selected.description}<br />
                          Trip: {selected.roundTripTime} mins<br />
                          Freq: {selected.frequency} mins
                        </Popup>
                      </Marker>
                    </>
                  )}
                </MapContainer>
              </div>
            </div>
          )}

          {/* Route Table */}
          <div className="card">
            <div className="card-header-custom">
              <h3><i className="bi bi-table" style={{ marginRight: 8, color: 'var(--gray-500)' }}></i>All Routes</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {routes.length === 0 ? (
                <EmptyState icon="bi-signpost" title="No routes found" description="Routes will appear here once added." />
              ) : (
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Route</th>
                      <th>Description</th>
                      <th>Round Trip (min)</th>
                      <th>Frequency (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, idx) => (
                      <tr key={route._id || idx}
                        style={{ cursor: 'pointer', background: selectedRoute === route.routeNumber ? 'var(--primary-light)' : undefined }}
                        onClick={() => setSelectedRoute(route.routeNumber)}>
                        <td style={{ color: 'var(--gray-400)' }}>{idx + 1}</td>
                        <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{route.routeNumber}</span></td>
                        <td>{route.description}</td>
                        <td>{route.roundTripTime}</td>
                        <td>{route.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default RoutesPage;
