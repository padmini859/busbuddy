import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bus, MapPin, Calendar, Clock, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { routeService } from '../services/routeService';
import { useLanguage } from '../contexts/LanguageContext';
import RouteTimeline from '../components/RouteTimeline';
import RouteMap from '../components/RouteMap';

const RouteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, getStopName } = useLanguage();

  const [routeDetail, setRouteDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await routeService.getRouteById(id);
        setRouteDetail(data);
      } catch (err) {
        setError(err.message || 'Failed to load route details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary)', fontSize: '1.2rem', fontWeight: '700' }}>{t('loading')}</div>
      </div>
    );
  }

  if (error || !routeDetail) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', borderColor: 'var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: '1rem' }}>{error || 'Route not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            &larr; Go Back
          </button>
        </div>
      </div>
    );
  }

  const stops = routeDetail.stops || [];
  const buses = routeDetail.buses || [];
  const schedules = routeDetail.schedules || [];
  const startingStop = stops.length > 0 ? stops[0] : null;
  const endingStop = stops.length > 0 ? stops[stops.length - 1] : null;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} />
        <span>{language === 'ta' ? 'பின்செல்க' : 'Back'}</span>
      </button>

      {/* Route Header Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {buses.map((b) => (
                <span
                  key={b.busId}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '1.35rem',
                    fontWeight: '800',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {b.busNumber}
                </span>
              ))}
              <span className="badge badge-primary">{routeDetail.direction} Direction</span>
              <span className="badge badge-secondary">{routeDetail.cityName || 'Coimbatore'}</span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem' }}>
              {routeDetail.routeName}
            </h1>

            {startingStop && endingStop && (
              <div style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>{getStopName(startingStop)}</span>
                <span>&rarr;</span>
                <span>{getStopName(endingStop)}</span>
                <span>&bull;</span>
                <span>{stops.length} Total Stops</span>
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('lastVerified')}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--success)' }}>
              {routeDetail.lastVerifiedAt ? new Date(routeDetail.lastVerifiedAt).toLocaleDateString() : 'Active Service'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Timeline / Right Interactive Map & Schedules */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="route-detail-grid">
        
        {/* Left Column: Vertical Timeline */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--secondary)" />
            <span>{t('timeline')}</span>
          </h2>
          <RouteTimeline stops={stops} />
        </div>

        {/* Right Column: Route Map & Scheduled Departures */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Interactive Map */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.85rem' }}>
              {language === 'ta' ? 'வழித்தட வரைபடம்' : 'Route Interactive Map'}
            </h2>
            <RouteMap stops={stops} height="360px" showPolyline={true} />
          </div>

          {/* Published Schedules */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--secondary)" />
                <span>{t('scheduledTimings')}</span>
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {schedules.length} Timetables
              </span>
            </div>

            {schedules.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Frequent city service. Contact terminus inquiry for live dispatch schedule.
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.75rem'
              }}>
                {schedules.map((s) => (
                  <div
                    key={s.scheduleId}
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.8rem',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)' }}>
                      {String(s.departureTime).slice(0, 5)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {s.serviceDay || 'Daily'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              &bull; {t('demoDataNotice')}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .route-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RouteDetailsPage;
