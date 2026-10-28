import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Bus, ArrowRight, Clock, IndianRupee, MapPin, AlertCircle, ArrowLeft, ChevronDown, ChevronUp, Shuffle } from 'lucide-react';
import { routeService } from '../services/routeService';
import { useLanguage } from '../contexts/LanguageContext';
import RouteTimeline from '../components/RouteTimeline';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const sourceId = searchParams.get('sourceId');
  const destinationId = searchParams.get('destinationId');
  const navigate = useNavigate();
  const { t, language, getStopName } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(null);
  const [error, setError] = useState('');
  const [expandedRoutes, setExpandedRoutes] = useState({});

  useEffect(() => {
    if (!sourceId || !destinationId) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await routeService.searchRoutes(sourceId, destinationId);
        setSearchData(res);
      } catch (err) {
        setError(err.message || t('errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sourceId, destinationId]);

  const toggleExpand = (key) => {
    setExpandedRoutes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary)', fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {t('loading')}
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Calculating direct and 1-transfer connections...</p>
      </div>
    );
  }

  const directRoutes = searchData?.directRoutes || [];
  const connectingRoutes = searchData?.connectingRoutes || [];
  const sourceStop = searchData?.sourceStop;
  const destinationStop = searchData?.destinationStop;
  const totalResults = directRoutes.length + connectingRoutes.length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Top Breadcrumb & Summary Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/')}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>{language === 'ta' ? 'புதிய தேடல்' : 'New Search'}</span>
        </button>

        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                {language === 'ta' ? 'தேடல் முடிவுகள்' : 'Journey Itinerary Search'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {getStopName(sourceStop)}
                </span>
                <ArrowRight size={20} color="var(--secondary)" />
                <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {getStopName(destinationStop)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                {totalResults} {totalResults === 1 ? 'Route Found' : 'Routes Found'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div style={{
        backgroundColor: '#FEF3C7',
        border: '1px solid #FDE68A',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        marginBottom: '2rem',
        fontSize: '0.82rem',
        color: '#92400E',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <AlertCircle size={16} />
        <span>{t('demoDataNotice')}</span>
      </div>

      {error && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: '600' }}>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && totalResults === 0 && (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)',
            margin: '0 auto 1.25rem'
          }}>
            <Bus size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {t('noRoutesFound')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {t('noRoutesHelp')}
          </p>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            {language === 'ta' ? 'மீண்டும் தேடுங்கள்' : 'Modify Search Criteria'}
          </button>
        </div>
      )}

      {/* Direct Routes Section */}
      {directRoutes.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{t('directRoute')}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              ({directRoutes.length})
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {directRoutes.map((route, idx) => {
              const isExpanded = expandedRoutes[`direct-${idx}`];
              return (
                <div key={route.routeId || idx} className="card" style={{ padding: '1.5rem' }}>
                  
                  {/* Route Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      
                      {/* Bus Numbers Chips */}
                      {(route.busNumbers || []).map((num) => (
                        <span
                          key={num}
                          style={{
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            padding: '0.25rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            letterSpacing: '0.02em'
                          }}
                        >
                          {num}
                        </span>
                      ))}

                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {route.routeName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {route.serviceType} Service &bull; Direction: {route.direction}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-direct">
                        {t('noTransfers')}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bar: Stops count, Fare, Next Departure */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '1rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {t('intermediateStops')}
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {route.intermediateStopsCount} {language === 'ta' ? 'நிறுத்தங்கள்' : 'stops'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {t('fare')}
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#15803D' }}>
                        ₹{route.fareAmount ? Number(route.fareAmount).toFixed(2) : '10.00'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {language === 'ta' ? 'புறப்படும் நேரங்கள் (மாதிரி)' : 'Scheduled Departures'}
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                        {route.scheduledDepartures && route.scheduledDepartures.length > 0
                          ? route.scheduledDepartures.slice(0, 3).map(s => String(s.departureTime).slice(0, 5)).join(', ') + '...'
                          : 'Frequent Regular Service'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(`direct-${idx}`)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span>{isExpanded ? (language === 'ta' ? 'நிறுத்தங்களை மறை' : 'Hide Stop Sequence') : (language === 'ta' ? 'நிறுத்தங்களின் வரிசையைக் காண்க' : 'View Stop Sequence')}</span>
                    </button>

                    <Link to={`/routes/${route.routeId}`} className="btn btn-primary btn-sm">
                      <span>{t('viewRoute')}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Expanded Timeline */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                        {language === 'ta' ? 'நிறுத்தங்களின் வரிசை பட்டியல்:' : 'Ordered Stop Sequence on this Service:'}
                      </div>
                      <RouteTimeline stops={route.intermediateStops} compact={true} />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Connecting Routes Section (1 Transfer) */}
      {connectingRoutes.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{t('connectingRoute')}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              ({connectingRoutes.length})
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {connectingRoutes.map((conn, idx) => {
              const isExpanded = expandedRoutes[`conn-${idx}`];
              return (
                <div key={idx} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
                  
                  {/* Top Transfer Badge & Transfer Stop Callout */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-connecting">
                        <Shuffle size={12} />
                        {t('oneTransfer')}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#B45309' }}>
                        {t('transferAt')}: {getStopName(conn.transferStop)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803D' }}>
                      Total Est. Fare: ₹{conn.totalEstimatedFare ? Number(conn.totalEstimatedFare).toFixed(2) : '20.00'}
                    </div>
                  </div>

                  {/* Two Legs Comparison Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {/* Leg 1 */}
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--secondary)', textTransform: 'uppercase' }}>
                          {t('firstLeg')}
                        </span>
                        <span style={{
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontWeight: '800',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem'
                        }}>
                          {conn.firstLeg.busNumbers?.join(', ') || 'Local'}
                        </span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                        {getStopName(conn.firstLeg.boardingStop)} &rarr; {getStopName(conn.firstLeg.destinationStop)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Route: {conn.firstLeg.routeName} ({conn.firstLeg.intermediateStopsCount} intermediate stops)
                      </div>
                    </div>

                    {/* Leg 2 */}
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#B45309', textTransform: 'uppercase' }}>
                          {t('secondLeg')}
                        </span>
                        <span style={{
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontWeight: '800',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem'
                        }}>
                          {conn.secondLeg.busNumbers?.join(', ') || 'Local'}
                        </span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                        {getStopName(conn.secondLeg.boardingStop)} &rarr; {getStopName(conn.secondLeg.destinationStop)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Route: {conn.secondLeg.routeName} ({conn.secondLeg.intermediateStopsCount} intermediate stops)
                      </div>
                    </div>
                  </div>

                  {/* Connection Note */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    &bull; {conn.connectionNote}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(`conn-${idx}`)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span>{isExpanded ? 'Hide Transfer Timeline' : 'View Transfer Timeline'}</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/routes/${conn.firstLeg.routeId}`} className="btn btn-outline btn-sm">
                        Leg 1 Route
                      </Link>
                      <Link to={`/routes/${conn.secondLeg.routeId}`} className="btn btn-primary btn-sm">
                        Leg 2 Route
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Transfer Timeline */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                        Leg 1: {conn.firstLeg.routeName}
                      </div>
                      <RouteTimeline stops={conn.firstLeg.intermediateStops} transferStopId={conn.transferStop?.stopId} compact={true} />

                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#B45309', margin: '1rem 0 0.5rem' }}>
                        Leg 2: {conn.secondLeg.routeName}
                      </div>
                      <RouteTimeline stops={conn.secondLeg.intermediateStops} transferStopId={conn.transferStop?.stopId} compact={true} />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchResultsPage;
