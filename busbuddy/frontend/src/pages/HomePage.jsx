import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Search, Bus, MapPin, Sparkles, Navigation, Clock, ShieldCheck } from 'lucide-react';
import StopAutocomplete from '../components/StopAutocomplete';
import { stopService } from '../services/stopService';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const { t, language, getStopName } = useLanguage();
  const navigate = useNavigate();

  const [sourceStop, setSourceStop] = useState(null);
  const [destinationStop, setDestinationStop] = useState(null);
  const [busNumberQuery, setBusNumberQuery] = useState('');
  const [popularStops, setPopularStops] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const stops = await stopService.getPopularStops();
        setPopularStops(stops || []);
      } catch (err) {
        console.error('Error fetching popular stops:', err);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopular();
  }, []);

  const handleSwapStops = () => {
    const temp = sourceStop;
    setSourceStop(destinationStop);
    setDestinationStop(temp);
    setSearchError('');
  };

  const handleRouteSearch = (e) => {
    e.preventDefault();
    if (!sourceStop || !destinationStop) {
      setSearchError(language === 'ta' ? 'புறப்படும் மற்றும் சேரும் நிறுத்தங்களை தேர்ந்தெடுக்கவும்' : 'Please select both source and destination stops');
      return;
    }
    if (sourceStop.stopId === destinationStop.stopId) {
      setSearchError(language === 'ta' ? 'புறப்படும் மற்றும் சேரும் நிறுத்தம் ஒன்றாக இருக்க முடியாது' : 'Source and destination stops cannot be the same');
      return;
    }
    setSearchError('');
    navigate(`/search?sourceId=${sourceStop.stopId}&destinationId=${destinationStop.stopId}`);
  };

  const handleBusNumberSearch = (e) => {
    e.preventDefault();
    if (busNumberQuery.trim()) {
      navigate(`/bus-search?number=${encodeURIComponent(busNumberQuery.trim())}`);
    }
  };

  const handleSelectPopular = (stop) => {
    if (!sourceStop) {
      setSourceStop(stop);
    } else if (!destinationStop && sourceStop.stopId !== stop.stopId) {
      setDestinationStop(stop);
    } else {
      setSourceStop(stop);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0D2B4D 0%, #123B68 50%, #1A4D84 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 0 4.5rem',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Top Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: '600',
              marginBottom: '1.25rem',
              backdropFilter: 'blur(4px)'
            }}>
              <Sparkles size={14} color="var(--accent)" />
              <span>{language === 'ta' ? 'தமிழ்நாடு உள்ளூர் பேருந்து தகவல் தளம்' : 'Tamil Nadu Local Transit Discovery'}</span>
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}>
              {t('heroTitle')}
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#CBD5E1',
              lineHeight: '1.6',
              marginBottom: '2.25rem',
              maxWidth: '680px',
              margin: '0 auto 2.25rem'
            }}>
              {t('heroSubtitle')}
            </p>

            {/* Main Search Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'left'
            }}>
              <form onSubmit={handleRouteSearch}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '0.75rem'
                }} className="search-grid">
                  
                  {/* Source Stop Autocomplete */}
                  <StopAutocomplete
                    id="source-stop"
                    label={t('sourceStop')}
                    value={sourceStop}
                    onChange={(val) => {
                      setSourceStop(val);
                      setSearchError('');
                    }}
                    placeholder={language === 'ta' ? 'புறப்படும் நிறுத்தம் (உதா: காந்திபுரம்)...' : 'Boarding stop (e.g. Gandhipuram)...'}
                  />

                  {/* Swap Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={handleSwapStops}
                      className="btn btn-outline"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        padding: 0,
                        borderColor: 'var(--border)',
                        color: 'var(--secondary)'
                      }}
                      title="Swap Source and Destination"
                    >
                      <ArrowLeftRight size={18} />
                    </button>
                  </div>

                  {/* Destination Stop Autocomplete */}
                  <StopAutocomplete
                    id="dest-stop"
                    label={t('destinationStop')}
                    value={destinationStop}
                    onChange={(val) => {
                      setDestinationStop(val);
                      setSearchError('');
                    }}
                    placeholder={language === 'ta' ? 'சென்றடையும் நிறுத்தம் (உதா: உக்கடம்)...' : 'Destination stop (e.g. Ukkadam)...'}
                  />
                </div>

                {searchError && (
                  <div style={{
                    marginTop: '0.75rem',
                    color: 'var(--danger)',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {searchError}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border)'
                }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {language === 'ta' ? 'நேரடி மற்றும் 1-இணைப்புப் பேருந்து வழிகளை ஒரே தேடலில் கண்டறியுங்கள்.' : 'Finds direct buses or smart 1-transfer connections across town.'}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-secondary btn-lg"
                    style={{ minWidth: '180px', fontWeight: '700' }}
                  >
                    <Search size={18} />
                    <span>{t('searchBuses')}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Search by Bus Number */}
            <div style={{
              marginTop: '1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              backdropFilter: 'blur(4px)'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: '600' }}>
                {t('searchByBusNumber')}:
              </span>
              <form onSubmit={handleBusNumberSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder={t('busNumberPlaceholder')}
                  value={busNumberQuery}
                  onChange={(e) => setBusNumberQuery(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    width: '160px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-accent btn-sm"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.75rem' }}
                >
                  <Search size={14} />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Stops Section */}
      <section style={{ padding: '3.5rem 0 2.5rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.01em' }}>
                {t('popularStops')}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {language === 'ta' ? 'விரைவாக தேர்ந்தெடுக்க ஏதேனும் ஒரு நிறுத்தத்தை கிளிக் செய்யவும்' : 'Click any stop to quickly set it as source or destination'}
              </p>
            </div>
            <button onClick={() => navigate('/all-stops')} className="btn btn-outline btn-sm">
              {t('allStops')} &rarr;
            </button>
          </div>

          {loadingPopular ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {t('loading')}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem'
            }}>
              {popularStops.map((stop) => (
                <div
                  key={stop.stopId}
                  onClick={() => handleSelectPopular(stop)}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'var(--secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--secondary)',
                      flexShrink: 0
                    }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {getStopName(stop)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {language === 'ta' ? stop.stopNameEn : stop.stopNameTa}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '600' }}>
                    Select
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {t('featuresTitle')}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Built specifically for everyday commuters in Tamil Nadu with reliability and ease of use.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Feature 1 */}
            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)',
                marginBottom: '1rem'
              }}>
                <Navigation size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {t('feature1Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {t('feature1Desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                marginBottom: '1rem'
              }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {t('feature2Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {t('feature2Desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803D',
                marginBottom: '1rem'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {t('feature3Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {t('feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
