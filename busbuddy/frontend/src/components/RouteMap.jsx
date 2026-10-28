import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../contexts/LanguageContext';

// Fix default Leaflet icon assets in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to auto-fit map view to stops bounds
const ChangeView = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [40, 40] });
      } catch (e) {
        // Fallback
      }
    }
  }, [bounds, map]);
  return null;
};

const createCustomPin = (order, isSpecial = false) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${isSpecial ? '#F59E0B' : '#123B68'};
        color: #FFFFFF;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 11px;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        ${order !== undefined && order !== null ? order : '•'}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const RouteMap = ({ stops = [], height = '450px', showPolyline = true }) => {
  const { language, getStopName } = useLanguage();

  const validStops = (stops || []).filter(
    (s) => s && s.latitude && s.longitude && !isNaN(s.latitude) && !isNaN(s.longitude)
  );

  // Default Center: Coimbatore
  const defaultCenter = [11.0168, 76.9678];
  const center = validStops.length > 0 ? [validStops[0].latitude, validStops[0].longitude] : defaultCenter;

  const polylineCoords = validStops.map((s) => [s.latitude, s.longitude]);
  const bounds = validStops.length > 1 ? polylineCoords : null;

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bounds && <ChangeView bounds={bounds} />}

        {/* Schematic Connecting Polyline */}
        {showPolyline && polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color="#2563EB"
            weight={4}
            opacity={0.8}
            dashArray="6, 6"
          />
        )}

        {/* Stop Markers */}
        {validStops.map((stop, index) => {
          const isTerminus = index === 0 || index === validStops.length - 1;
          const pinIcon = createCustomPin(index + 1, isTerminus);

          return (
            <Marker
              key={stop.stopId || index}
              position={[stop.latitude, stop.longitude]}
              icon={pinIcon}
            >
              <Popup>
                <div style={{ padding: '0.2rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0F172A' }}>
                    {getStopName(stop)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.3rem' }}>
                    {language === 'ta' ? stop.stopNameEn : stop.stopNameTa}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    GPS: {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}
                  </div>
                  {stop.servingRoutesCount !== undefined && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#2563EB', fontWeight: '600' }}>
                      {stop.servingRoutesCount} {language === 'ta' ? 'வழித்தடங்கள்' : 'routes serving this stop'}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Schematic Route Legend Banner */}
      {showPolyline && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow-sm)',
          backdropFilter: 'blur(4px)'
        }}>
          <span>Note: Connecting line represents schematic transit sequence.</span>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
