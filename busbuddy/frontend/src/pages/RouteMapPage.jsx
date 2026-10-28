import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Route, Layers, Info } from 'lucide-react';
import { stopService } from '../services/stopService';
import { routeService } from '../services/routeService';
import { useLanguage } from '../contexts/LanguageContext';
import RouteMap from '../components/RouteMap';

const RouteMapPage = () => {
  const [searchParams] = useSearchParams();
  const highlightedStopId = searchParams.get('stopId');
  const { t, language, getStopName } = useLanguage();

  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stopsData, routesData] = await Promise.all([
          stopService.getAllStops(),
          routeService.getAllRoutes(),
        ]);
        setStops(stopsData || []);
        setRoutes(routesData || []);
      } catch (err) {
        console.error('Error fetching map data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedRouteId) {
      setRouteStops([]);
      return;
    }
    const fetchRouteStops = async () => {
      try {
        const data = await routeService.getRouteStops(selectedRouteId);
        setRouteStops(data || []);
      } catch (err) {
        console.error('Error fetching route stops:', err);
      }
    };
    fetchRouteStops();
  }, [selectedRouteId]);

  const displayedStops = selectedRouteId ? routeStops : stops;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.4rem' }}>
            {t('routeMap')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {language === 'ta'
              ? 'கோயம்புத்தூர் நகர பேருந்து நிறுத்தங்கள் மற்றும் வழித்தடங்களின் ஊடாடும் வரைபடம்.'
              : 'Interactive OpenStreetMap showing verified bus stop coordinates and route alignments.'}
          </p>
        </div>

        {/* Route Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Layers size={18} color="var(--secondary)" />
          <select
            className="form-control"
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            style={{ width: '280px', fontWeight: '600' }}
          >
            <option value="">{language === 'ta' ? 'அனைத்து பேருந்து நிறுத்தங்கள் (நகர வரைபடம்)' : 'All Stops (City-wide Network)'}</option>
            {routes.map((r) => (
              <option key={r.routeId} value={r.routeId}>
                {r.routeName} ({r.direction})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Badge */}
      <div style={{
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        marginBottom: '1.5rem',
        fontSize: '0.82rem',
        color: '#1E40AF',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Info size={16} />
        <span>
          {selectedRouteId
            ? `Viewing sequence for route with ${routeStops.length} ordered stops. Numbers represent stop sequence.`
            : `Displaying all ${stops.length} registered bus stops in Coimbatore. Select a route above to isolate its stop sequence.`}
        </span>
      </div>

      {/* Map Container Card */}
      <div className="card" style={{ padding: '0.5rem' }}>
        {loading ? (
          <div style={{ height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {t('loading')}
          </div>
        ) : (
          <RouteMap
            stops={displayedStops}
            height="550px"
            showPolyline={!!selectedRouteId}
          />
        )}
      </div>

    </div>
  );
};

export default RouteMapPage;
